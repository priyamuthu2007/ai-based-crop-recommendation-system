import os
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.preprocessing import LabelEncoder
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from xgboost import XGBClassifier
from preprocess import preprocess_df

DATA_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'data', 'processed', 'Crop_recommendation_processed.csv')
REPORT_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'notebooks', 'iteration_metrics.csv')


def metrics(y_true, y_pred):
    return {
        'accuracy': accuracy_score(y_true, y_pred),
        'precision_weighted': precision_score(y_true, y_pred, average='weighted', zero_division=0),
        'recall_weighted': recall_score(y_true, y_pred, average='weighted', zero_division=0),
        'f1_weighted': f1_score(y_true, y_pred, average='weighted', zero_division=0),
    }


df = pd.read_csv(DATA_PATH)
X, y, _ = preprocess_df(df, 'Crop')

# Same held-out data for fair comparison.
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
label_encoder = LabelEncoder().fit(y)
y_train_encoded = label_encoder.transform(y_train)

results = []

# Iteration 1: default tree baseline.
model = DecisionTreeClassifier(random_state=42)
model.fit(X_train, y_train)
row = {'iteration': 'Iteration 1 - default baseline', 'configuration': 'Default DecisionTreeClassifier'}
row.update(metrics(y_test, model.predict(X_test)))
results.append(row)

# Compare ensemble classifiers on the same held-out test set.
model_comparisons = [
    (
        'Random Forest',
        RandomForestClassifier(n_estimators=300, random_state=42, n_jobs=-1),
        y_train,
    ),
    (
        'XGBoost',
        XGBClassifier(
            n_estimators=300,
            max_depth=6,
            learning_rate=0.1,
            objective='multi:softprob',
            num_class=len(label_encoder.classes_),
            eval_metric='mlogloss',
            tree_method='hist',
            random_state=42,
            n_jobs=-1,
        ),
        y_train_encoded,
    ),
]

for model_name, model, training_labels in model_comparisons:
    model.fit(X_train, training_labels)
    predictions = model.predict(X_test)
    if model_name == 'XGBoost':
        predictions = label_encoder.inverse_transform(predictions.astype(int))
    row = {
        'iteration': 'Model comparison',
        'configuration': model_name,
    }
    row.update(metrics(y_test, predictions))
    results.append(row)

# Iteration 2: regularized tree to reduce overfitting.
model = DecisionTreeClassifier(max_depth=12, min_samples_leaf=2, random_state=42)
model.fit(X_train, y_train)
row = {'iteration': 'Iteration 2 - regularized tree', 'configuration': 'max_depth=12, min_samples_leaf=2'}
row.update(metrics(y_test, model.predict(X_test)))
results.append(row)

# Final approach: select conservative parameters using training-only 5-fold CV.
search = GridSearchCV(
    DecisionTreeClassifier(random_state=42),
    param_grid={
        'max_depth': [None, 8, 12, 16],
        'min_samples_leaf': [1, 2, 4],
        'criterion': ['gini', 'entropy'],
    },
    scoring='f1_weighted',
    cv=5,
    n_jobs=-1,
)
search.fit(X_train, y_train)
row = {
    'iteration': 'Final approach - tuned Decision Tree',
    'configuration': str(search.best_params_),
}
row.update(metrics(y_test, search.predict(X_test)))
results.append(row)

report = pd.DataFrame(results)
report.to_csv(REPORT_PATH, index=False)
print(report.to_string(index=False))
print('\nBest parameters:', search.best_params_)
print('Saved:', REPORT_PATH)
