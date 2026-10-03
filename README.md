AI-based Crop Recommendation System

This project is now demo-ready: it includes a trained Decision Tree model, a preprocessing pipeline, and a working crop recommendation interface that calls a local prediction API.

What's included:
- `src/train.py`: trains a `DecisionTreeClassifier` from the processed crop dataset.
- `src/preprocess.py`: dataframe cleaning and preprocessing utilities.
- `src/inference.py`: loads or trains the model and returns a crop recommendation from form input.
- `src/server.py`: a local HTTP server that serves the UI and exposes the `/predict` API.
- `ui/`: responsive farmer-facing crop recommendation interface.
- `requirements.txt`: Python dependencies.
- `models/`: trained model output.

How to run the demo:

```bash
python -m pip install -r requirements.txt
python src/server.py
```

Then open `http://localhost:8000` in the browser.

Optional: train the model again manually:

```bash
python src/train.py --data-path data/processed/Crop_recommendation_processed.csv --target-column Crop --model-out models/decision_tree.pkl
```

The UI now sends field values to the backend, which returns the actual model prediction and confidence score.
