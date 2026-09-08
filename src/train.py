import argparse
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import classification_report, accuracy_score, precision_score, recall_score, f1_score
import joblib
from preprocess import preprocess_df


def main(data_path: str, target_col: str, model_out: str):
    df = pd.read_csv(data_path)
    X, y, target_col = preprocess_df(df, target_col)
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    clf = DecisionTreeClassifier(random_state=42)
    clf.fit(X_train, y_train)

    preds = clf.predict(X_test)
    print("Accuracy:", accuracy_score(y_test, preds))
    print("Precision (weighted):", precision_score(y_test, preds, average="weighted", zero_division=0))
    print("Recall (weighted):", recall_score(y_test, preds, average="weighted", zero_division=0))
    print("F1 score (weighted):", f1_score(y_test, preds, average="weighted", zero_division=0))
    print("Precision (macro):", precision_score(y_test, preds, average="macro", zero_division=0))
    print("Recall (macro):", recall_score(y_test, preds, average="macro", zero_division=0))
    print("F1 score (macro):", f1_score(y_test, preds, average="macro", zero_division=0))
    print("\nClassification report:\n", classification_report(y_test, preds, zero_division=0))

    joblib.dump(clf, model_out)
    print("Saved model to:", model_out)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Train Decision Tree baseline')
    parser.add_argument('--data-path', type=str, required=True, help='Path to CSV dataset')
    parser.add_argument('--target-column', type=str, required=True, help='Name of the target column')
    parser.add_argument('--model-out', type=str, default='models/decision_tree.pkl', help='Output path for saved model')
    args = parser.parse_args()
    main(args.data_path, args.target_column, args.model_out)
