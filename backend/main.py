"""
FastAPI Backend — Hanoi High School Admissions Analytics
Endpoints:
  GET /api/schools           - All schools, optional ?name= filter
  GET /api/schools/{id}      - Single school by TT index
  GET /api/stats             - Aggregate statistics
  GET /api/distribution      - Ratio histogram buckets
  GET /api/top               - Top-N schools, ?by=ratio|nv1|total&n=10
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import pandas as pd
import math
import os

app = FastAPI(title="Hanoi Admissions API", version="1.0.0")

# ── CORS ────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Serve frontend static files ──────────────────────────────────────────────
FRONTEND_DIR = os.path.join(os.path.dirname(__file__), "..", "frontend")
if os.path.isdir(FRONTEND_DIR):
    app.mount("/app", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")

# ── Load Data ────────────────────────────────────────────────────────────────
CSV_PATH = os.path.join(os.path.dirname(__file__), "schools.csv")

def load_data() -> pd.DataFrame:
    df = pd.read_csv(CSV_PATH, encoding="utf-8-sig")
    df.columns = ["tt", "name", "quota", "nv1", "nv2", "nv3", "total", "ratio"]
    df["tt"]    = df["tt"].astype(int)
    df["quota"] = df["quota"].astype(int)
    df["nv1"]   = df["nv1"].astype(int)
    df["nv2"]   = df["nv2"].astype(int)
    df["nv3"]   = df["nv3"].astype(int)
    df["total"] = df["nv1"] + df["nv2"] + df["nv3"]
    df["ratio"] = (df["nv1"] / df["quota"]).round(2)
    return df

DF = load_data()

def safe(val):
    """Convert numpy/nan to Python-native types."""
    if isinstance(val, float) and math.isnan(val):
        return None
    try:
        return val.item()
    except Exception:
        return val

# ── Endpoints ────────────────────────────────────────────────────────────────

@app.get("/")
def root():
    return {"message": "Hanoi Admissions API running. Docs at /docs"}


@app.get("/api/schools")
def get_schools(
    name: str = Query(default="", description="Filter by school name (partial, case-insensitive)"),
    sort_by: str = Query(default="tt", description="Column to sort: tt|quota|nv1|nv2|nv3|total|ratio"),
    sort_dir: str = Query(default="asc", description="asc or desc"),
    ratio_min: float = Query(default=0.0),
    ratio_max: float = Query(default=10.0),
    quota_min: int   = Query(default=0),
    quota_max: int   = Query(default=99999),
):
    df = DF.copy()

    # Name filter
    if name:
        df = df[df["name"].str.contains(name, case=False, na=False)]

    # Range filters
    df = df[(df["ratio"] >= ratio_min) & (df["ratio"] <= ratio_max)]
    df = df[(df["quota"] >= quota_min) & (df["quota"] <= quota_max)]

    # Sort
    valid_cols = {"tt", "quota", "nv1", "nv2", "nv3", "total", "ratio"}
    if sort_by not in valid_cols:
        sort_by = "tt"
    ascending = sort_dir.lower() != "desc"
    df = df.sort_values(by=sort_by, ascending=ascending)

    records = df.to_dict(orient="records")
    return {"count": len(records), "data": records}


@app.get("/api/schools/{school_id}")
def get_school(school_id: int):
    row = DF[DF["tt"] == school_id]
    if row.empty:
        raise HTTPException(status_code=404, detail=f"School with TT={school_id} not found")
    return row.iloc[0].to_dict()


@app.get("/api/stats")
def get_stats():
    df = DF
    ratios = df["ratio"]
    return {
        "total_schools":     int(len(df)),
        "total_quota":       int(df["quota"].sum()),
        "total_nv1":         int(df["nv1"].sum()),
        "total_nv2":         int(df["nv2"].sum()),
        "total_nv3":         int(df["nv3"].sum()),
        "total_aspirations": int(df["total"].sum()),
        "ratio": {
            "mean":   round(float(ratios.mean()), 3),
            "median": round(float(ratios.median()), 3),
            "min":    float(ratios.min()),
            "max":    float(ratios.max()),
            "std":    round(float(ratios.std()), 3),
        },
        "above_avg_ratio":   int((ratios >= ratios.mean()).sum()),
        "below_avg_ratio":   int((ratios <  ratios.mean()).sum()),
        "highly_competitive":int((ratios >= 2.0).sum()),   # ratio >= 2
        "nv1_vs_quota_ratio": round(float(df["nv1"].sum() / df["quota"].sum()), 3),
    }


@app.get("/api/distribution")
def get_distribution(bins: int = Query(default=10, ge=3, le=30)):
    """Return histogram bucket data for ratio distribution."""
    ratios = DF["ratio"]
    min_val, max_val = float(ratios.min()), float(ratios.max())
    step = (max_val - min_val) / bins
    buckets = []
    for i in range(bins):
        lo = round(min_val + i * step, 2)
        hi = round(min_val + (i + 1) * step, 2)
        count = int(((ratios >= lo) & (ratios < (hi if i < bins - 1 else hi + 0.001))).sum())
        buckets.append({"label": f"{lo}–{hi}", "lo": lo, "hi": hi, "count": count})
    return {"bins": buckets}


@app.get("/api/analysis")
def full_analysis():
    """Comprehensive statistical analysis with descriptive stats, correlation, box plot."""
    df = DF

    def series_stats(s):
        n   = len(s)
        mean_ = float(s.mean())
        std_  = float(s.std())
        if std_ == 0:
            skew, kurt = 0.0, 0.0
        else:
            skew = float(((s - mean_) ** 3).mean() / std_ ** 3)
            kurt = float(((s - mean_) ** 4).mean() / std_ ** 4 - 3)
        q1 = float(s.quantile(0.25))
        q3 = float(s.quantile(0.75))
        iqr = q3 - q1
        return {
            "n":        n,
            "mean":     round(mean_, 3),
            "median":   round(float(s.median()), 3),
            "std":      round(std_, 3),
            "variance": round(float(s.var()), 3),
            "min":      float(s.min()),
            "max":      float(s.max()),
            "range":    round(float(s.max() - s.min()), 3),
            "q1":       round(q1, 3),
            "q3":       round(q3, 3),
            "iqr":      round(iqr, 3),
            "skewness": round(skew, 3),
            "kurtosis": round(kurt, 3),
            "p10":      round(float(s.quantile(0.10)), 3),
            "p25":      round(float(s.quantile(0.25)), 3),
            "p75":      round(float(s.quantile(0.75)), 3),
            "p90":      round(float(s.quantile(0.90)), 3),
            "p95":      round(float(s.quantile(0.95)), 3),
            "se":       round(std_ / n**0.5, 4),
            "ci95_lo":  round(mean_ - 1.96 * std_ / n**0.5, 3),
            "ci95_hi":  round(mean_ + 1.96 * std_ / n**0.5, 3),
        }

    cols = ["quota", "nv1", "nv2", "nv3", "total", "ratio"]
    corr = df[cols].corr().round(3).to_dict()

    r = df["ratio"]
    q1 = float(r.quantile(0.25))
    q3 = float(r.quantile(0.75))
    iqr = q3 - q1
    fence_lo = q1 - 1.5 * iqr
    fence_hi = q3 + 1.5 * iqr
    outlier_rows = df[(r < fence_lo) | (r > fence_hi)][["tt", "name", "ratio"]].to_dict(orient="records")

    return {
        "ratio_stats":   series_stats(df["ratio"]),
        "quota_stats":   series_stats(df["quota"]),
        "nv1_stats":     series_stats(df["nv1"]),
        "nv2_stats":     series_stats(df["nv2"]),
        "nv3_stats":     series_stats(df["nv3"]),
        "total_stats":   series_stats(df["total"]),
        "correlation_matrix": corr,
        "boxplot": {
            "q1": round(q1, 3),
            "q2": round(float(r.median()), 3),
            "q3": round(q3, 3),
            "whisker_lo": round(float(max(r.min(), fence_lo)), 3),
            "whisker_hi": round(float(min(r.max(), fence_hi)), 3),
            "outliers":   [round(float(v), 3) for v in r[(r < fence_lo) | (r > fence_hi)].tolist()],
        },
        "outlier_schools": outlier_rows,
        "tier_counts": {
            "Rất cao (≥2.5)":   int((r >= 2.5).sum()),
            "Cao (2.0–2.5)":    int(((r >= 2.0) & (r < 2.5)).sum()),
            "Trung bình (1.5–2.0)": int(((r >= 1.5) & (r < 2.0)).sum()),
            "Thấp (1.0–1.5)":   int(((r >= 1.0) & (r < 1.5)).sum()),
            "Rất thấp (<1.0)":  int((r < 1.0).sum()),
        },
    }


@app.get("/api/schools-enriched")
def schools_enriched(
    sort_by:  str = Query(default="ratio"),
    sort_dir: str = Query(default="desc"),
    tier:     str = Query(default="", description="Filter by tier label"),
    outlier:  bool = Query(default=False, description="Only outliers"),
    pct_min:  float = Query(default=0.0),
    pct_max:  float = Query(default=100.0),
):
    """Schools with z-score, percentile rank, tier label, and outlier flag."""
    df = DF.copy()
    mean_r = float(df["ratio"].mean())
    std_r  = float(df["ratio"].std())
    q1 = float(df["ratio"].quantile(0.25))
    q3 = float(df["ratio"].quantile(0.75))
    iqr = q3 - q1

    df["z_score"]      = ((df["ratio"] - mean_r) / std_r).round(3)
    df["percentile"]   = (df["ratio"].rank(pct=True) * 100).round(1)
    df["nv1_vs_quota"] = (df["nv1"] / df["quota"]).round(2)
    df["is_outlier"]   = (df["ratio"] < q1 - 1.5 * iqr) | (df["ratio"] > q3 + 1.5 * iqr)

    def tier_label(r):
        if r >= 2.5: return "Rất cao"
        if r >= 2.0: return "Cao"
        if r >= 1.5: return "Trung bình"
        if r >= 1.0: return "Thấp"
        return "Rất thấp"

    df["tier"] = df["ratio"].apply(tier_label)

    # Filters
    if tier:    df = df[df["tier"] == tier]
    if outlier: df = df[df["is_outlier"] == True]
    df = df[(df["percentile"] >= pct_min) & (df["percentile"] <= pct_max)]

    valid = {"tt","quota","nv1","nv2","nv3","total","ratio","z_score","percentile","nv1_vs_quota"}
    if sort_by not in valid: sort_by = "ratio"
    df = df.sort_values(by=sort_by, ascending=(sort_dir.lower() != "desc"))

    records = df.to_dict(orient="records")
    for rec in records:
        rec["is_outlier"] = bool(rec["is_outlier"])
    return {"count": len(records), "data": records}


@app.get("/api/regression")
def regression_analysis():
    """Linear regression between pairs of variables."""
    df = DF

    def regress(x_col, y_col):
        x = df[x_col].astype(float)
        y = df[y_col].astype(float)
        n = len(x)
        sx, sy = float(x.sum()), float(y.sum())
        sxy = float((x * y).sum())
        sx2 = float((x**2).sum())
        slope = (n * sxy - sx * sy) / (n * sx2 - sx**2)
        intercept = (sy - slope * sx) / n
        y_hat = slope * x + intercept
        ss_tot = float(((y - y.mean())**2).sum())
        ss_res = float(((y - y_hat)**2).sum())
        r2 = max(0.0, 1 - ss_res / ss_tot) if ss_tot > 0 else 0.0
        cov = float(((x - x.mean()) * (y - y.mean())).sum() / (n - 1))
        r_p = cov / (float(x.std()) * float(y.std())) if x.std() * y.std() > 0 else 0.0
        return {
            "slope":     round(slope, 5),
            "intercept": round(intercept, 4),
            "r2":        round(r2, 4),
            "r":         round(r_p, 4),
            "x_min":     float(x.min()),
            "x_max":     float(x.max()),
            "y_at_xmin": round(slope * float(x.min()) + intercept, 3),
            "y_at_xmax": round(slope * float(x.max()) + intercept, 3),
        }

    return {
        "quota_vs_ratio":  regress("quota", "ratio"),
        "nv1_vs_ratio":   regress("nv1",   "ratio"),
        "total_vs_ratio": regress("total", "ratio"),
        "quota_vs_nv1":   regress("quota", "nv1"),
    }


@app.get("/api/compare")
def compare_schools(ids: str = Query(description="Comma-separated TT IDs e.g. 1,20,90")):
    """Return enriched data for 2–5 selected schools."""
    try:
        id_list = [int(i.strip()) for i in ids.split(",")][:5]
    except Exception:
        raise HTTPException(400, "Invalid IDs")
    df = DF.copy()
    df["z_score"]    = ((df["ratio"] - df["ratio"].mean()) / df["ratio"].std()).round(3)
    df["percentile"] = (df["ratio"].rank(pct=True) * 100).round(1)
    selected = df[df["tt"].isin(id_list)]
    if selected.empty:
        raise HTTPException(404, "No schools found")
    return {"data": selected.round(3).to_dict(orient="records")}


@app.get("/api/top")
def get_top(
    by:  str = Query(default="ratio", description="Field: ratio|nv1|nv2|nv3|total|quota"),
    n:   int = Query(default=10, ge=1, le=50),
    dir: str = Query(default="desc"),
):
    valid = {"ratio", "nv1", "nv2", "nv3", "total", "quota"}
    if by not in valid:
        by = "ratio"
    ascending = dir.lower() != "desc"
    df = DF.sort_values(by=by, ascending=ascending).head(n)
    return {"data": df.to_dict(orient="records")}


@app.get("/api/rankings")
def get_rankings(
    category: str = Query(default="all", description="all|nv1|nv2|nv3|ratio|quota"),
    limit: int = Query(default=20, ge=5, le=50)
):
    """Get comprehensive rankings by different categories."""
    df = DF.copy()
    
    rankings = {}
    
    if category in ["all", "ratio"]:
        rankings["by_ratio"] = df.nlargest(limit, "ratio")[["tt", "name", "ratio", "nv1", "quota"]].to_dict(orient="records")
    
    if category in ["all", "nv1"]:
        rankings["by_nv1"] = df.nlargest(limit, "nv1")[["tt", "name", "nv1", "quota", "ratio"]].to_dict(orient="records")
    
    if category in ["all", "nv2"]:
        rankings["by_nv2"] = df.nlargest(limit, "nv2")[["tt", "name", "nv2", "nv1", "nv3", "total"]].to_dict(orient="records")
    
    if category in ["all", "nv3"]:
        rankings["by_nv3"] = df.nlargest(limit, "nv3")[["tt", "name", "nv3", "nv1", "nv2", "total"]].to_dict(orient="records")
    
    if category in ["all", "quota"]:
        rankings["by_quota"] = df.nlargest(limit, "quota")[["tt", "name", "quota", "nv1", "ratio"]].to_dict(orient="records")
    
    if category in ["all", "total"]:
        rankings["by_total"] = df.nlargest(limit, "total")[["tt", "name", "total", "nv1", "nv2", "nv3"]].to_dict(orient="records")
    
    return rankings


@app.get("/api/school-detail/{school_id}")
def get_school_detail(school_id: int):
    """Get detailed information and statistics for a specific school."""
    row = DF[DF["tt"] == school_id]
    if row.empty:
        raise HTTPException(status_code=404, detail=f"School with TT={school_id} not found")
    
    school = row.iloc[0].to_dict()
    
    # Calculate additional metrics
    all_ratios = DF["ratio"]
    school_ratio = school["ratio"]
    
    # Percentile rank
    percentile = (DF["ratio"] < school_ratio).sum() / len(DF) * 100
    
    # Z-score
    mean_ratio = float(all_ratios.mean())
    std_ratio = float(all_ratios.std())
    z_score = (school_ratio - mean_ratio) / std_ratio if std_ratio > 0 else 0
    
    # Ranking positions
    rank_by_ratio = int((DF["ratio"] > school_ratio).sum() + 1)
    rank_by_nv1 = int((DF["nv1"] > school["nv1"]).sum() + 1)
    rank_by_quota = int((DF["quota"] > school["quota"]).sum() + 1)
    rank_by_total = int((DF["total"] > school["total"]).sum() + 1)
    
    # Competition tier
    if school_ratio >= 2.5:
        tier = "Rất cao"
        tier_color = "#ef4444"
    elif school_ratio >= 2.0:
        tier = "Cao"
        tier_color = "#f59e0b"
    elif school_ratio >= 1.5:
        tier = "Trung bình"
        tier_color = "#3b82f6"
    elif school_ratio >= 1.0:
        tier = "Thấp"
        tier_color = "#10b981"
    else:
        tier = "Rất thấp"
        tier_color = "#6b7280"
    
    # NV distribution percentages
    total_nv = school["total"]
    nv_distribution = {
        "nv1_percent": round((school["nv1"] / total_nv * 100), 1) if total_nv > 0 else 0,
        "nv2_percent": round((school["nv2"] / total_nv * 100), 1) if total_nv > 0 else 0,
        "nv3_percent": round((school["nv3"] / total_nv * 100), 1) if total_nv > 0 else 0,
    }
    
    # Similar schools (by ratio)
    similar_df = DF[
        (DF["ratio"] >= school_ratio - 0.3) & 
        (DF["ratio"] <= school_ratio + 0.3) &
        (DF["tt"] != school_id)
    ].copy()
    similar_df["diff"] = abs(similar_df["ratio"] - school_ratio)
    similar = similar_df.nsmallest(5, "diff")[["tt", "name", "ratio"]].to_dict(orient="records")
    
    return {
        "school": school,
        "statistics": {
            "percentile": round(percentile, 1),
            "z_score": round(z_score, 2),
            "tier": tier,
            "tier_color": tier_color,
        },
        "rankings": {
            "by_ratio": rank_by_ratio,
            "by_nv1": rank_by_nv1,
            "by_quota": rank_by_quota,
            "by_total": rank_by_total,
        },
        "nv_distribution": nv_distribution,
        "similar_schools": similar,
        "city_comparison": {
            "avg_ratio": round(mean_ratio, 2),
            "avg_quota": int(DF["quota"].mean()),
            "avg_nv1": int(DF["nv1"].mean()),
        }
    }
