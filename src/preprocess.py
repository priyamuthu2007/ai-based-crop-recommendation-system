import pandas as pd
from typing import Optional, Tuple
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler


def detect_target(df: pd.DataFrame) -> str:
    """Heuristic to pick a target column if not provided.
    Prefers common names like 'crop', 'target', 'label', otherwise
    picks a low-cardinality object column or the last column.
    """
    for name in ('target', 'label', 'crop', 'crop_name', 'class'):
        if name in df.columns:
            return name
    obj_cols = df.select_dtypes(include=['object', 'category', 'string']).columns.tolist()
    # pick low-cardinality object
    candidates = [(df[c].nunique(dropna=True), c) for c in obj_cols]
    candidates = [c for c in candidates if c[0] <= 50]
    if candidates:
        candidates.sort()
        return candidates[0][1]
    return df.columns[-1]


def clean_dataframe(df: pd.DataFrame) -> pd.DataFrame:
    """Basic cleaning: strip whitespace in string columns, drop exact duplicates,
    and normalize column names.
    """
    df = df.copy()
    # normalize column names
    df.columns = [c.strip() for c in df.columns]
    # strip whitespace in object columns
    obj_cols = df.select_dtypes(include=['object', 'string']).columns
    for c in obj_cols:
        df[c] = df[c].astype(str).str.strip()
    # drop exact duplicate rows
    df = df.drop_duplicates()
    return df


def preprocess_df(df: pd.DataFrame, target_col: Optional[str] = None, scale: bool = False) -> Tuple[pd.DataFrame, pd.Series, str]:
    """Clean, impute, encode and (optionally) scale features.

    Returns: (X_df, y_series, detected_target_name)
    The returned X_df is one-hot encoded for categorical columns.
    """
    df = clean_dataframe(df)
    if target_col is None or target_col not in df.columns:
        target_col = detect_target(df)
    y = df[target_col]
    X = df.drop(columns=[target_col])

    # numeric imputation
    num_cols = X.select_dtypes(include=['number']).columns.tolist()
    if num_cols:
        num_imp = SimpleImputer(strategy='mean')
        X[num_cols] = num_imp.fit_transform(X[num_cols])

    # categorical imputation + one-hot
    cat_cols = X.select_dtypes(include=['object', 'category', 'string']).columns.tolist()
    if cat_cols:
        cat_imp = SimpleImputer(strategy='most_frequent')
        X[cat_cols] = cat_imp.fit_transform(X[cat_cols])
        X = pd.get_dummies(X, columns=cat_cols, drop_first=True)

    # optional scaling
    if scale and not X.empty:
        scaler = StandardScaler()
        X[num_cols] = scaler.fit_transform(X[num_cols])

    return X, y, target_col


def save_processed(X: pd.DataFrame, y: pd.Series, out_path: str):
    """Save processed features and target as a CSV with target as the last column."""
    out_df = X.copy()
    out_df[y.name if y.name is not None else 'target'] = y.values
    out_df.to_csv(out_path, index=False)

