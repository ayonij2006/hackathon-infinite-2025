import pandas as pd
import numpy as np
import random
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, confusion_matrix
import joblib
import os

from models.CreatePackageRequest import CreatePackageRequest, MapModel

delimiters = [',', '\t', ';', '|', ':', '~|~']
qualifiers = ['"', "'", '`', '']
MODEL_PATH = 'delimitermodel.pkl'
file_path = 'output.txt'

def generate_lines(delim, qual, n_lines=10, min_cols=3, max_cols=10):
    lines = []
    for _ in range(n_lines):
        n_cols = random.randint(min_cols, max_cols)
        row = [random.choice(['apple', 'banana', '42', '3.14', 'test', '100', '0', '1', 'yes', 'no', '', 'NULL']) for _ in range(n_cols)]
        if qual:
            row = [f"{qual}{item}{qual}" if item else '' for item in row]
        lines.append(delim.join(row))
    return lines

def extract_features(lines):
    features = []
    for delim in delimiters:
        counts = [line.count(delim) for line in lines]
        features.append(np.mean(counts))
        features.append(np.var(counts))
    for qual in qualifiers:
        if qual:
            counts = [line.count(qual) for line in lines]
            features.append(np.mean(counts))
            features.append(np.var(counts))
            fields_with_qual = 0
            total_fields = 0
            lengths = []
            for line in lines:
                max_delim = max(delimiters, key=lambda d: line.count(d))
                split_fields = line.split(max_delim)
                total_fields += len(split_fields)
                for f in split_fields:
                    if f.startswith(qual) and f.endswith(qual):
                        fields_with_qual += 1
                        lengths.append(len(f))
            fraction = fields_with_qual / total_fields if total_fields > 0 else 0
            avg_len = np.mean(lengths) if lengths else 0
            features.append(fraction)
            features.append(avg_len)
        else:
            features.extend([0.0, 0.0, 0.0, 0.0])
    return features

def train_model():
    X_train, y_train, X_test, y_test = [], [], [], []
    for delim_idx, delim in enumerate(delimiters):
        for qual_idx, qual in enumerate(qualifiers):
            label = delim_idx * len(qualifiers) + qual_idx
            for _ in range(600):
                lines = generate_lines(delim, qual)
                X_train.append(extract_features(lines))
                y_train.append(label)
            for _ in range(20):
                lines = generate_lines(delim, qual)
                X_test.append(extract_features(lines))
                y_test.append(label)
    clf = RandomForestClassifier(random_state=42)
    clf.fit(X_train, y_train)
    joblib.dump(clf, MODEL_PATH)
    y_pred = clf.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    cm = confusion_matrix(y_test, y_pred)
    print(f"\nModel Accuracy: {acc:.2f}")
    print("Confusion Matrix:")
    print(cm)
    return clf

def row_separator(file_path, max_bytes=8192):
    with open(file_path, 'rb') as f:
        content = f.read(max_bytes)
    crlf = content.count(b'\r\n')
    lf = content.count(b'\n') - crlf
    cr = content.count(b'\r') - crlf
    if crlf > lf and crlf > cr:
        return 'CRLF'
    elif lf > crlf and lf > cr:
        return 'LF'
    elif cr > crlf and cr > lf:
        return 'CR'
    elif crlf == lf == cr == 0:
        return 'None'
    else:
        return 'Unknown'

def predict_delim_and_qualifier(file_path, clf, sample_lines=20):
    lines = []
    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        for _ in range(sample_lines):
            line = f.readline()
            if not line:
                break
            lines.append(line.strip())
    features = extract_features(lines)
    pred_label = clf.predict([features])[0]
    delim_idx = pred_label // len(qualifiers)
    qual_idx = pred_label % len(qualifiers)
    return delimiters[delim_idx], qualifiers[qual_idx]

def infer_sql_types(series):
    s = series.astype(str).str.strip().str.strip('"').str.strip("'").str.strip('`')
    s = s.replace(['NULL', 'null', '', 'NaN'], np.nan).dropna()

    if s.empty:
        return "VARCHAR(255)"
    if s.str.fullmatch(r'\d+').sum() / len(s) > 0.9:
        return "INT"
    
    if s.str.contains(r'[-/]').sum() / len(s) > 0.5:
        parsed = pd.to_datetime(s, errors='coerce')
        if parsed.notnull().sum() / len(s) > 0.8:
            return "DATETIME"
    try:
        s.astype(float)
        return "FLOAT"
    except:
        pass

    bool_vals = set(['true', 'false', 'yes', 'no', '1', '0'])
    if s.str.lower().isin(bool_vals).sum() / len(s) > 0.8:
        return "BIT"

    return "VARCHAR(255)"

def main(filename: str):
    file_path = filename
    if os.path.exists(MODEL_PATH):
        clf = joblib.load(MODEL_PATH)
    else:
        clf = train_model()

    row_sep = row_separator(file_path)
    print(f"Row Separator: {row_sep}")

    field_delim, field_qual = predict_delim_and_qualifier(file_path, clf)
    print(f"Predicted Delimiter: {repr(field_delim)}")
    print(f"Predicted Qualifier: {repr(field_qual) if field_qual else 'None'}")

    try:
        if len(field_delim) > 1:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                lines = [line.strip() for line in f.readlines() if line.strip()]
            rows = [line.split(field_delim) for line in lines]
            rows = [[field.strip(field_qual) if field_qual else field for field in row] for row in rows]
            df = pd.DataFrame(rows[1:], columns=rows[0])
        else:
            df = pd.read_csv(file_path, delimiter=field_delim, quotechar=field_qual if field_qual else '"')
    except Exception as e:
        print(f"Error reading file: {e}")
        return

    mappings = []
    for col in df.columns:
        col_name = col.strip('"').strip("'").strip('`')
        datatype = infer_sql_types(df[col])
        mappings.append(MapModel(
            src_column_name=col_name,
            trg_column_name=col_name,
            datatype=datatype
        ))

    return CreatePackageRequest(
        field_qualifier=field_qual,
        field_delimiter=field_delim,
        row_separator=row_sep,
        filePath=file_path,
        mappings=mappings
    )

