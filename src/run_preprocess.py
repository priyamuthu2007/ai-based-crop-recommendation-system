import os
import glob
import pandas as pd
from preprocess import preprocess_df, save_processed

ROOT = os.path.dirname(os.path.dirname(__file__))
CSV_GLOB = os.path.join(ROOT, '**', '*.csv')
OUT_DIR = os.path.join(ROOT, 'data', 'processed')
os.makedirs(OUT_DIR, exist_ok=True)

csv_files = [p for p in glob.glob(CSV_GLOB, recursive=True) if 'venv' not in p and 'processed' not in p]
for path in csv_files:
    try:
        df = pd.read_csv(path)
    except Exception as e:
        print('skip', path, 'read error', e)
        continue
    X, y, target = preprocess_df(df)
    out_name = os.path.splitext(os.path.basename(path))[0] + '_processed.csv'
    out_path = os.path.join(OUT_DIR, out_name)
    save_processed(X, y, out_path)
    print('wrote', out_path)
