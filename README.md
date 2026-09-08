AI-based Crop Recommendation System (25% complete)

This repository contains a starter scaffold for a crop recommendation system using a Decision Tree baseline (25% implementation completed).

What's included:
- `src/train.py`: initial training script using `DecisionTreeClassifier`.
- `src/preprocess.py`: simple preprocessing helper.
- `notebooks/EDA.md`: notes and steps for exploratory data analysis.
- `ui/`: responsive farmer-facing crop recommendation interface.
- `requirements.txt`: Python dependencies.
- `models/`: directory where trained models will be saved.

To view the interface:

```bash
python -m http.server 8000 --directory ui
```

Open `http://localhost:8000`. The current interface includes a demo recommendation interaction; it is ready to connect to the trained Decision Tree model in the next phase.

Next steps (I'll do after you provide datasets):
- Run EDA on your CSVs and refine preprocessing
- Train and tune Decision Tree baseline
- Save model and add inference API/CLI

To run locally:

```bash
python -m pip install -r requirements.txt
python src/train.py --data-path data/your_dataset.csv --target-column target
```
