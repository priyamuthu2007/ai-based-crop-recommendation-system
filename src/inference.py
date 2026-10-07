import json
import math
from functools import lru_cache
from pathlib import Path

import numpy as np
import pandas as pd

ROOT = Path(__file__).resolve().parent.parent
MODEL_PATH = ROOT / "models" / "crop_profile.json"
DATASET_PATH = ROOT / "data" / "processed" / "Crop_recommendation_processed.csv"
FEATURE_ORDER = [
    "Nitrogen",
    "Phosphorus",
    "Potassium",
    "Temperature",
    "Humidity",
    "pH_Value",
    "Rainfall",
]
INPUT_RANGES = {
    "Nitrogen": (0, 200),
    "Phosphorus": (0, 200),
    "Potassium": (0, 200),
    "Temperature": (-10, 60),
    "Humidity": (0, 100),
    "pH_Value": (0, 14),
    "Rainfall": (0, 1000),
}
FEATURE_LABELS = {
    "Nitrogen": ("Nitrogen", "kg/ha"),
    "Phosphorus": ("Phosphorus", "kg/ha"),
    "Potassium": ("Potassium", "kg/ha"),
    "Temperature": ("Temperature", "°C"),
    "Humidity": ("Humidity", "%"),
    "pH_Value": ("Soil pH", ""),
    "Rainfall": ("Rainfall", "mm"),
}

ALIASES = {
    "nitrogen": "Nitrogen",
    "phosphorus": "Phosphorus",
    "potassium": "Potassium",
    "temperature": "Temperature",
    "humidity": "Humidity",
    "ph": "pH_Value",
    "ph_value": "pH_Value",
    "pH": "pH_Value",
    "pH_Value": "pH_Value",
    "rainfall": "Rainfall",
    "Rainfall": "Rainfall",
}

CROP_MESSAGE = {
    "Rice": "Your field conditions show a strong fit for a healthy rice season.",
    "Maize": "Your nutrient profile is a good match for a productive maize season.",
    "Jute": "This field shows a favorable environment for a productive jute cycle.",
    "Cotton": "Your soil and climate profile suits a strong cotton yield.",
    "Coconut": "The moisture and soil profile indicate a good coconut growing fit.",
    "Papaya": "Your water and temperature conditions align well with papaya production.",
    "Orange": "These field characteristics support a promising orange crop.",
    "Apple": "This environment is well suited for apple cultivation.",
    "Muskmelon": "Your conditions suggest a strong muskmelon season.",
    "Watermelon": "The current field profile is favorable for watermelon growth.",
    "Grapes": "Your land and climate conditions support a healthy grapes cycle.",
    "Mango": "This field profile aligns well with a productive mango season.",
    "Banana": "The nutrient balance and moisture suggest a strong banana yield.",
    "Pomegranate": "These conditions are suitable for a robust pomegranate crop.",
    "KidneyBeans": "Your field profile fits a healthy kidney bean season.",
    "Blackgram": "The current soil and weather conditions suggest a good blackgram cycle.",
    "ChickPea": "Your current soil and weather profile shows a promising chickpea fit.",
    "Chickpea": "Your current soil and weather profile shows a promising chickpea fit.",
    "Coffee": "This field setup appears favorable for a healthy coffee crop.",
    "Sugarcane": "The field profile aligns well with sugarcane growth.",
    "Soyabean": "Your farmland conditions favor a productive soyabean season.",
    "Cashew": "This environment is compatible with a healthy cashew crop.",
    "Pear": "Your conditions are suitable for a good pear orchard cycle.",
    "Lentil": "This field profile is a solid match for lentil cultivation.",
    "Groundnut": "The soil and rainfall balance support a promising groundnut crop.",
    "Peas": "The climate and field conditions look favorable for peas.",
    "Mustard": "This field profile is suitable for mustard cultivation.",
    "Paddy": "The moisture profile suggests a strong paddy growing season.",
    "Tomato": "The weather conditions are suitable for tomato production.",
    "PigeonPeas": "This field profile matches the growing needs of pigeon peas well.",
    "MothBeans": "Your conditions suggest a strong moth bean crop.",
    "MungBean": "The soil and climate profile suits mung bean cultivation.",
    "Coconut": "The moisture and soil profile indicate a good coconut growing fit.",
    "Cotton": "Your soil and climate profile suits a strong cotton yield.",
}


def _build_model_profile():
    if not DATASET_PATH.exists():
        raise FileNotFoundError(f"Training dataset not found: {DATASET_PATH}")

    df = pd.read_csv(DATASET_PATH)
    target_col = "Crop"
    if target_col not in df.columns:
        raise ValueError(f"Expected target column '{target_col}' in {DATASET_PATH}")

    grouped = df.groupby(target_col)[FEATURE_ORDER].mean()
    profile = {
        crop: {feature: float(grouped.loc[crop, feature]) for feature in FEATURE_ORDER}
        for crop in grouped.index
    }

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    MODEL_PATH.write_text(json.dumps(profile, indent=2), encoding="utf-8")
    return profile


def _load_model_profile():
    if MODEL_PATH.exists():
        return json.loads(MODEL_PATH.read_text(encoding="utf-8"))
    return _build_model_profile()


@lru_cache(maxsize=1)
def _load_training_ranges():
    if not DATASET_PATH.exists():
        return None

    df = pd.read_csv(DATASET_PATH)
    missing_columns = [name for name in FEATURE_ORDER if name not in df.columns]
    if missing_columns:
        raise ValueError(
            f"Training dataset is missing required features: {', '.join(missing_columns)}"
        )
    ranges = {}
    for feature in FEATURE_ORDER:
        values = pd.to_numeric(df[feature], errors="coerce")
        values = values[np.isfinite(values)]
        if values.empty:
            raise ValueError(f"Training dataset has no valid values for {feature}.")
        ranges[feature] = (float(values.min()), float(values.max()))
    return ranges


def _normalize_payload(payload):
    if not isinstance(payload, dict):
        raise ValueError("Input payload must be a JSON object.")

    normalized = {}
    for key, value in payload.items():
        if value is None or value == "":
            continue
        try:
            number = float(value)
        except (TypeError, ValueError) as exc:
            if str(key).strip() in ALIASES:
                raise ValueError(f"'{key}' must be a valid number.") from exc
            continue
        if str(key).strip() in ALIASES:
            if not math.isfinite(number):
                raise ValueError(f"'{key}' must be a finite number.")
            normalized[key] = number

    features = {}
    for source_key, value in normalized.items():
        target_key = ALIASES.get(str(source_key).strip())
        if target_key:
            features[target_key] = value

    missing = [name for name in FEATURE_ORDER if name not in features]
    if missing:
        raise ValueError(f"Missing required fields: {', '.join(missing)}")

    for feature, value in features.items():
        minimum, maximum = INPUT_RANGES[feature]
        if value < minimum or value > maximum:
            label = FEATURE_LABELS[feature][0]
            raise ValueError(
                f"{label} must be between {minimum:g} and {maximum:g}."
            )
    return {name: features[name] for name in FEATURE_ORDER}


def predict_crop(payload):
    profile = _load_model_profile()
    values = _normalize_payload(payload)
    input_vector = np.array([values[name] for name in FEATURE_ORDER], dtype=float)

    feature_means = {
        crop: np.array([crop_profile[name] for name in FEATURE_ORDER], dtype=float)
        for crop, crop_profile in profile.items()
    }
    global_matrix = np.array([
        feature_means[crop] for crop in feature_means
    ], dtype=float)
    feature_stds = np.maximum(np.std(global_matrix, axis=0), 1e-6)

    scores = {}
    for crop, crop_vector in feature_means.items():
        diff = (input_vector - crop_vector) / feature_stds
        distance = float(np.linalg.norm(diff))
        scores[crop] = 1.0 / (1.0 + distance)

    ranked_scores = sorted(scores.items(), key=lambda item: (-item[1], item[0]))
    best_crop, best_score = ranked_scores[0]
    recommendations = [
        {
            "crop": crop,
            "match_score": round(score * 100, 1),
        }
        for crop, score in ranked_scores[:3]
    ]
    closest_features = sorted(
        enumerate(FEATURE_ORDER),
        key=lambda item: abs(
            (input_vector[item[0]] - feature_means[best_crop][item[0]])
            / feature_stds[item[0]]
        ),
    )[:3]
    reasons = []
    for _, feature in closest_features:
        label, unit = FEATURE_LABELS[feature]
        value = f"{values[feature]:g}"
        formatted_value = f"{value} {unit}" if unit else value
        reasons.append(
            f"{label} {formatted_value} is close to {best_crop}'s typical profile."
        )

    range_warnings = []
    training_ranges = _load_training_ranges()
    if training_ranges:
        for feature in FEATURE_ORDER:
            minimum, maximum = training_ranges[feature]
            value = values[feature]
            if value < minimum or value > maximum:
                range_warnings.append(
                    {
                        "feature": feature,
                        "value": value,
                        "minimum": minimum,
                        "maximum": maximum,
                    }
                )

    return {
        "crop": best_crop,
        "confidence": recommendations[0]["match_score"],
        "recommendations": recommendations,
        "reasons": reasons,
        "out_of_training_range": range_warnings,
        "message": CROP_MESSAGE.get(best_crop, f"This field profile is a good match for {best_crop}."),
    }
