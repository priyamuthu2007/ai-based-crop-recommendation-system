import os
import pandas as pd
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
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

results = []

# Iteration 1: default tree baseline.
model = DecisionTreeClassifier(random_state=42)
model.fit(X_train, y_train)
row = {'iteration': 'Iteration 1 - default baseline', 'configuration': 'Default DecisionTreeClassifier'}
row.update(metrics(y_test, model.predict(X_test)))
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
