import os
import glob
import pandas as pd
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

ROOT = os.path.join(os.path.dirname(os.path.dirname(__file__)))
CSV_GLOB = os.path.join(ROOT, '**', '*.csv')
OUT_MD = os.path.join(ROOT, 'notebooks', 'eda_report.md')
FIG_DIR = os.path.join(ROOT, 'notebooks', 'figures')

os.makedirs(FIG_DIR, exist_ok=True)

csv_files = [p for p in glob.glob(CSV_GLOB, recursive=True) if 'venv' not in p]

if not csv_files:
    print('No CSV files found under project.')
    raise SystemExit(1)

report_lines = ["# EDA Report\n"]

def detect_target(df: pd.DataFrame):
    candidates = []
    for c in df.columns:
        nunique = df[c].nunique(dropna=True)
        dtype = df[c].dtype
        if c.lower() in ('target','label','crop','crop_name','class'):
            return c
        # prefer low-cardinality object columns
        if dtype == object and nunique <= 20:
            candidates.append((nunique, c))
    if candidates:
        candidates.sort()
        return candidates[0][1]
    # fallback: last column
    return df.columns[-1]

for path in csv_files:
    try:
        df = pd.read_csv(path)
    except Exception as e:
        report_lines.append(f"## {path}\nCould not read CSV: {e}\n")
        continue
    report_lines.append(f"## {os.path.relpath(path, ROOT)}\n")
    report_lines.append(f"- Shape: {df.shape}\n")
    report_lines.append(f"- Columns: {len(df.columns)}\n")

    report_lines.append('\n### Column info\n')
    report_lines.append('|column|dtype|non-null|unique|\n|---|---:|---:|---:|\n')
    for c in df.columns:
        report_lines.append(f"|{c}|{df[c].dtype}|{df[c].count()}|{df[c].nunique()}|\n")

    report_lines.append('\n### Missing values\n')
    miss = df.isna().sum()
    for c,v in miss.items():
        if v>0:
            report_lines.append(f"- {c}: {v}\n")

    # detect target
    target = detect_target(df)
    report_lines.append(f"\n### Suggested target column: **{target}**\n")

    # Save small head
    report_lines.append('\n### Head (first 10 rows)\n')
    report_lines.append(df.head(10).to_markdown() + '\n')

    # Plots: numeric histograms
    num_cols = df.select_dtypes(include=['number']).columns.tolist()
    for c in num_cols:
        try:
            fig_path = os.path.join(FIG_DIR, f"{os.path.basename(path)}-{c}.png")
            plt.figure(figsize=(6,3))
            df[c].dropna().hist(bins=30)
            plt.title(f"{os.path.basename(path)} - {c}")
            plt.tight_layout()
            plt.savefig(fig_path)
            plt.close()
            report_lines.append(f"![{c}]({os.path.relpath(fig_path, ROOT)})\n")
        except Exception:
            continue

    # Categorical top values
    cat_cols = df.select_dtypes(include=['object','category']).columns.tolist()
    for c in cat_cols:
        try:
            top = df[c].value_counts().head(10)
            fig_path = os.path.join(FIG_DIR, f"{os.path.basename(path)}-{c}-bar.png")
            plt.figure(figsize=(6,3))
            top.plot(kind='bar')
            plt.title(f"{os.path.basename(path)} - {c} (top 10)")
            plt.tight_layout()
            plt.savefig(fig_path)
            plt.close()
            report_lines.append(f"![{c}]({os.path.relpath(fig_path, ROOT)})\n")
        except Exception:
            continue

    report_lines.append('\n---\n')

with open(OUT_MD, 'w', encoding='utf-8') as f:
    f.writelines([l if l.endswith('\n') else l + '\n' for l in report_lines])

print('EDA report written to', OUT_MD)
