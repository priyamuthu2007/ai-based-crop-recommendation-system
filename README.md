Nalvidhai — AI-based Crop Recommendation

Nalvidhai is the farmer-facing name of this crop recommendation demo. It includes a trained Decision Tree model, a preprocessing pipeline, and a working crop recommendation interface that calls a local prediction API. Its sprouting-seed logo represents growth grounded in soil and field conditions.

What's included:
- `src/train.py`: trains a `DecisionTreeClassifier` from the processed crop dataset.
- `src/preprocess.py`: dataframe cleaning and preprocessing utilities.
- `src/inference.py`: loads or trains the model and returns a crop recommendation from form input.
- `src/auth.py`: stores farmer accounts in SQLite and manages password hashes and sessions.
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

Compare Decision Tree, Random Forest, and XGBoost on the same stratified test split:

```bash
python src/compare_iterations.py
```

The results, including accuracy and weighted precision, recall, and F1, are saved to `notebooks/iteration_metrics.csv`.

The live recommender currently uses crop-profile similarity scores, not calibrated model probabilities. The comparison report is an offline evaluation and does not change the live prediction model.

## Email and password sign-in

Nalvidhai opens on an email/password sign-in screen. Farmers can create an account with their name, email, and a password of at least 8 characters, or sign in with an existing account. Email/password accounts are stored in `data/fieldwise_auth.sqlite3`; passwords are salted and hashed, and browser sessions use an HttpOnly cookie. Crop recommendations require a signed-in session. Sign out revokes the session.

This demo does not send email verification or password-reset messages, and it should not be exposed to the public internet without HTTPS, deployment hardening, and an email-recovery flow.

## Farmer input helpers

- **Weather:** Search for a town or use browser location permission to fill current temperature and humidity, plus the total precipitation forecast for the next 16 days. Open-Meteo geocoding and forecast services require an internet connection. Review the rainfall value: its forecast window may not match the rainfall period represented by the crop training data.
- **Soil report:** Select an English-labeled photo or PDF (up to 15 MB; PDFs may have up to 10 pages). OCR extracts N, P, K, and pH in the browser; scanned PDFs are OCR-processed on their first three pages. Uploaded reports are not sent to this app's server. The pinned PDF.js and Tesseract.js libraries and English OCR data are loaded from jsDelivr, so internet access is required for OCR.
- **Language and voice:** The interface supports English, Tamil, and Hindi. Voice input uses the browser's Speech Recognition API where available; browser support and speech-processing privacy vary. Speak a field name followed by its numeric value, then verify the recognized values.

OCR and speech results are suggestions, not verified lab measurements. Check the units and all values before requesting a crop match.
