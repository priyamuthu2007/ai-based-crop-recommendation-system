import json
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


def _normalize_payload(payload):
    if not isinstance(payload, dict):
        raise ValueError("Input payload must be a JSON object.")

    normalized = {}
    for key, value in payload.items():
        if value is None or value == "":
            continue
        try:
            normalized[key] = float(value)
        except (TypeError, ValueError):
            continue

    features = {}
    for source_key, value in normalized.items():
        target_key = ALIASES.get(str(source_key).strip())
        if target_key:
            features[target_key] = value

    missing = [name for name in FEATURE_ORDER if name not in features]
    if missing:
        raise ValueError(f"Missing required fields: {', '.join(missing)}")

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

    best_crop, best_score = max(scores.items(), key=lambda item: item[1])
    total_score = sum(scores.values()) or 1.0
    confidence = round((best_score / total_score) * 100, 1)
    confidence = max(55.0, min(confidence, 99.9))

    return {
        "crop": best_crop,
        "confidence": round(confidence, 1),
        "message": CROP_MESSAGE.get(best_crop, f"This field profile is a good match for {best_crop}."),
    }
