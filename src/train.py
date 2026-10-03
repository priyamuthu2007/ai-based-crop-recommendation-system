import argparse
import json
from pathlib import Path

import pandas as pd

FEATURE_ORDER = [
    "Nitrogen",
    "Phosphorus",
    "Potassium",
    "Temperature",
    "Humidity",
    "pH_Value",
    "Rainfall",
]


def build_crop_profile(data_path: str, target_col: str, model_out: str):
    df = pd.read_csv(data_path)
    if target_col not in df.columns:
        raise ValueError(f"Target column '{target_col}' not found in dataset")

    grouped = df.groupby(target_col)[FEATURE_ORDER].mean()
    profile = {
        crop: {feature: float(grouped.loc[crop, feature]) for feature in FEATURE_ORDER}
        for crop in grouped.index
    }

    out_path = Path(model_out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text(json.dumps(profile, indent=2), encoding="utf-8")
    print(f"Saved crop profile to: {out_path}")
    return profile


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Train a demo crop baseline profile")
    parser.add_argument("--data-path", type=str, required=True, help="Path to the processed crop CSV")
    parser.add_argument("--target-column", type=str, default="Crop", help="Column name for crop label")
    parser.add_argument("--model-out", type=str, default="models/crop_profile.json", help="Output path for saved profile")
    args = parser.parse_args()
    build_crop_profile(args.data_path, args.target_column, args.model_out)
