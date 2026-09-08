import glob
import pandas as pd
import os

paths = sorted(glob.glob(os.path.join('data','processed','*.csv')))
if not paths:
    print('No processed CSVs found')
    raise SystemExit(1)

for path in paths:
    df = pd.read_csv(path)
    print('FILE:', path)
    print('shape:', df.shape)
    miss = df.isna().sum().sort_values(ascending=False)
    print('\nmissing (top 20):')
    print(miss.head(20).to_string())
    print('\nduplicates:', int(df.duplicated().sum()))
    print('last column (target guess):', df.columns[-1])
    print('\nhead:')
    print(df.head().to_string())
    print('\n' + ('-'*60) + '\n')
