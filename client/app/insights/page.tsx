"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { schoolsApi } from "@/lib/api";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Target,
  Users,
  Award,
  BarChart3,
  Brain,
  Lightbulb,
} from "lucide-react";

const COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981", "#6b7280"];

export default function InsightsPage() {
  const [mounted, setMounted] = useState(false);

  const { data: response, isLoading: schoolsLoading } = useQuery({
    queryKey: ["schools"],
    queryFn: () => schoolsApi.getAll(),
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: schoolsApi.getStats,
  });

  const { data: analysis, isLoading: analysisLoading } = useQuery({
    queryKey: ["analysis"],
    queryFn: schoolsApi.getAnalysis,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || schoolsLoading || statsLoading || analysisLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-4 text-muted-foreground">Đang phân tích dữ liệu...</p>
          </div>
        </div>
      </div>
    );
  }

  const schools = response?.data || [];

  // Advanced Statistical Analysis
  const calculateCorrelation = (x: number[], y: number[]) => {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
    const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0);
    const sumY2 = y.reduce((sum, yi) => sum + yi * yi, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  };

  // Correlation Analysis
  const quotas = schools.map((s) => s.quota);
  const ratios = schools.map((s) => s.ratio);
  const nv1s = schools.map((s) => s.nv1);
  const totals = schools.map((s) => s.total);

  const correlations = {
    quotaVsRatio: calculateCorrelation(quotas, ratios),
    nv1VsRatio: calculateCorrelation(nv1s, ratios),
    quotaVsNV1: calculateCorrelation(quotas, nv1s),
    totalVsRatio: calculateCorrelation(totals, ratios),
  };

  // Tier Distribution
  const tierCounts = analysis?.tier_counts || {};
  const tierData = Object.entries(tierCounts).map(([name, count]) => ({
    name,
    count,
  }));

  // Outlier Analysis
  const outliers = analysis?.outlier_schools || [];

  // Distribution Analysis
  const ratioRanges = [
    { range: "< 1.0", schools: schools.filter((s) => s.ratio < 1.0) },
    { range: "1.0-1.5", schools: schools.filter((s) => s.ratio >= 1.0 && s.ratio < 1.5) },
    { range: "1.5-2.0", schools: schools.filter((s) => s.ratio >= 1.5 && s.ratio < 2.0) },
    { range: "2.0-2.5", schools: schools.filter((s) => s.ratio >= 2.0 && s.ratio < 2.5) },
    { range: "≥ 2.5", schools: schools.filter((s) => s.ratio >= 2.5) },
  ];

  const distributionData = ratioRanges.map((r) => ({
    range: r.range,
    count: r.schools.length,
    percentage: ((r.schools.length / schools.length) * 100).toFixed(1),
  }));

  // Scatter plot data for correlation
  const scatterData = schools.map((s) => ({
    quota: s.quota,
    ratio: s.ratio,
    name: s.name,
  }));

  // NV Preference Analysis
  const nvPreferenceData = schools.map((s) => {
    const total = s.nv1 + s.nv2 + s.nv3;
    return {
      name: s.name.length > 15 ? s.name.substring(0, 15) + "..." : s.name,
      nv1Percent: ((s.nv1 / total) * 100).toFixed(1),
      nv2Percent: ((s.nv2 / total) * 100).toFixed(1),
      nv3Percent: ((s.nv3 / total) * 100).toFixed(1),
    };
  });

  // Top insights
  const topByRatio = [...schools].sort((a, b) => b.ratio - a.ratio).slice(0, 5);
  const bottomByRatio = [...schools].sort((a, b) => a.ratio - b.ratio).slice(0, 5);
  const mostPopular = [...schools].sort((a, b) => b.nv1 - a.nv1).slice(0, 5);

  // Statistical Summary
  const ratioStats = analysis?.ratio_stats || {};

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary">
            <Brain className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Phân tích chuyên sâu</h1>
            <p className="text-muted-foreground">
              Data Science & Statistical Analysis
            </p>
          </div>
        </div>
      </div>

      {/* Key Statistical Metrics */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-6">
          <div className="mb-2 text-sm font-medium text-muted-foreground">
            Trung bình (Mean)
          </div>
          <div className="text-3xl font-bold">{ratioStats.mean?.toFixed(3)}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            Độ lệch chuẩn: {ratioStats.std?.toFixed(3)}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="mb-2 text-sm font-medium text-muted-foreground">
            Trung vị (Median)
          </div>
          <div className="text-3xl font-bold">{ratioStats.median?.toFixed(3)}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            IQR: {ratioStats.iqr?.toFixed(3)}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="mb-2 text-sm font-medium text-muted-foreground">
            Độ lệch (Skewness)
          </div>
          <div className="text-3xl font-bold">{ratioStats.skewness?.toFixed(3)}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {ratioStats.skewness > 0 ? "Lệch phải" : "Lệch trái"}
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="mb-2 text-sm font-medium text-muted-foreground">
            Độ nhọn (Kurtosis)
          </div>
          <div className="text-3xl font-bold">{ratioStats.kurtosis?.toFixed(3)}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {ratioStats.kurtosis > 0 ? "Nhọn hơn chuẩn" : "Bẹt hơn chuẩn"}
          </div>
        </div>
      </div>

      {/* Correlation Analysis */}
      <div className="mb-8 rounded-xl border bg-card p-6">
        <h2 className="mb-4 flex items-center gap-2 text-xl font-bold">
          <BarChart3 className="h-5 w-5 text-primary" />
          Phân tích tương quan (Correlation Analysis)
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border p-4">
            <div className="mb-2 text-sm text-muted-foreground">
              Chỉ tiêu ↔ Tỷ lệ chọi
            </div>
            <div className="text-2xl font-bold">
              {correlations.quotaVsRatio.toFixed(3)}
            </div>
            <div className="mt-1 text-xs">
              {Math.abs(correlations.quotaVsRatio) < 0.3
                ? "Tương quan yếu"
                : Math.abs(correlations.quotaVsRatio) < 0.7
                ? "Tương quan trung bình"
                : "Tương quan mạnh"}
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="mb-2 text-sm text-muted-foreground">NV1 ↔ Tỷ lệ chọi</div>
            <div className="text-2xl font-bold">
              {correlations.nv1VsRatio.toFixed(3)}
            </div>
            <div className="mt-1 text-xs">
              {Math.abs(correlations.nv1VsRatio) < 0.3
                ? "Tương quan yếu"
                : Math.abs(correlations.nv1VsRatio) < 0.7
                ? "Tương quan trung bình"
                : "Tương quan mạnh"}
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="mb-2 text-sm text-muted-foreground">
              Chỉ tiêu ↔ NV1
            </div>
            <div className="text-2xl font-bold">
              {correlations.quotaVsNV1.toFixed(3)}
            </div>
            <div className="mt-1 text-xs">
              {Math.abs(correlations.quotaVsNV1) < 0.3
                ? "Tương quan yếu"
                : Math.abs(correlations.quotaVsNV1) < 0.7
                ? "Tương quan trung bình"
                : "Tương quan mạnh"}
            </div>
          </div>

          <div className="rounded-lg border p-4">
            <div className="mb-2 text-sm text-muted-foreground">
              Tổng HS ↔ Tỷ lệ chọi
            </div>
            <div className="text-2xl font-bold">
              {correlations.totalVsRatio.toFixed(3)}
            </div>
            <div className="mt-1 text-xs">
              {Math.abs(correlations.totalVsRatio) < 0.3
                ? "Tương quan yếu"
                : Math.abs(correlations.totalVsRatio) < 0.7
                ? "Tương quan trung bình"
                : "Tương quan mạnh"}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* Distribution Chart */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Phân phối tỷ lệ chọi (Distribution)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={distributionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-card p-3 shadow-lg">
                        <p className="font-semibold">{payload[0].payload.range}</p>
                        <p className="text-sm">
                          Số trường: {payload[0].value}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {payload[0].payload.percentage}% tổng số
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="count" fill="#3b82f6">
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Tier Distribution */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">
            Phân loại mức độ cạnh tranh
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={tierData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Scatter Plot */}
        <div className="rounded-xl border bg-card p-6 lg:col-span-2">
          <h3 className="mb-4 text-lg font-semibold">
            Scatter Plot: Chỉ tiêu vs Tỷ lệ chọi
          </h3>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="quota"
                name="Chỉ tiêu"
                label={{ value: "Chỉ tiêu", position: "bottom" }}
              />
              <YAxis
                type="number"
                dataKey="ratio"
                name="Tỷ lệ chọi"
                label={{ value: "Tỷ lệ chọi", angle: -90, position: "left" }}
              />
              <Tooltip
                cursor={{ strokeDasharray: "3 3" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-card p-3 shadow-lg">
                        <p className="font-semibold">{payload[0].payload.name}</p>
                        <p className="text-sm">
                          Chỉ tiêu: {payload[0].payload.quota}
                        </p>
                        <p className="text-sm">
                          Tỷ lệ chọi: {payload[0].payload.ratio.toFixed(2)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter data={scatterData} fill="#3b82f6" />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Insights */}
      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        {/* Top 5 Most Competitive */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <TrendingUp className="h-5 w-5 text-red-500" />
            Top 5 cạnh tranh nhất
          </h3>
          <div className="space-y-3">
            {topByRatio.map((school, index) => (
              <div key={school.tt} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-sm font-bold text-red-500">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{school.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Tỷ lệ: {school.ratio.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top 5 Least Competitive */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <TrendingDown className="h-5 w-5 text-green-500" />
            Top 5 ít cạnh tranh nhất
          </h3>
          <div className="space-y-3">
            {bottomByRatio.map((school, index) => (
              <div key={school.tt} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10 text-sm font-bold text-green-500">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{school.name}</div>
                  <div className="text-xs text-muted-foreground">
                    Tỷ lệ: {school.ratio.toFixed(2)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Popular */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Award className="h-5 w-5 text-amber-500" />
            Top 5 được ưa chuộng nhất
          </h3>
          <div className="space-y-3">
            {mostPopular.map((school, index) => (
              <div key={school.tt} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-sm font-bold text-amber-500">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">{school.name}</div>
                  <div className="text-xs text-muted-foreground">
                    NV1: {school.nv1.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Outliers */}
      {outliers.length > 0 && (
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <AlertCircle className="h-5 w-5 text-amber-500" />
            Outliers (Giá trị bất thường)
          </h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Các trường có tỷ lệ chọi nằm ngoài khoảng IQR (Interquartile Range)
          </p>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {outliers.map((school: { tt: number; name: string; ratio: number }) => (
              <div key={school.tt} className="rounded-lg border p-3">
                <div className="font-semibold">{school.name}</div>
                <div className="text-sm text-muted-foreground">
                  Tỷ lệ chọi: {school.ratio.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Data Science Insights */}
      <div className="rounded-xl border bg-gradient-to-br from-primary/10 to-secondary/10 p-6">
        <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
          <Lightbulb className="h-5 w-5 text-primary" />
          Kết luận từ Data Science
        </h3>
        <div className="space-y-3 text-sm">
          <p>
            <strong>1. Phân phối:</strong> Dữ liệu có độ lệch{" "}
            {ratioStats.skewness > 0 ? "dương (phải)" : "âm (trái)"} với skewness ={" "}
            {ratioStats.skewness?.toFixed(3)}, cho thấy{" "}
            {ratioStats.skewness > 0
              ? "có một số trường có tỷ lệ chọi rất cao kéo trung bình lên"
              : "phần lớn trường có tỷ lệ chọi tập trung ở mức cao"}.
          </p>
          <p>
            <strong>2. Tương quan:</strong> Hệ số tương quan giữa chỉ tiêu và tỷ lệ chọi là{" "}
            {correlations.quotaVsRatio.toFixed(3)}, cho thấy{" "}
            {Math.abs(correlations.quotaVsRatio) < 0.3
              ? "không có mối liên hệ rõ ràng - tỷ lệ chọi phụ thuộc nhiều vào uy tín và chất lượng trường hơn là số lượng chỉ tiêu"
              : "có mối liên hệ đáng kể giữa quy mô tuyển sinh và mức độ cạnh tranh"}.
          </p>
          <p>
            <strong>3. Độ biến thiên:</strong> Độ lệch chuẩn là {ratioStats.std?.toFixed(3)}, cho
            thấy{" "}
            {ratioStats.std > 0.5
              ? "sự chênh lệch lớn giữa các trường - thí sinh cần cân nhắc kỹ lựa chọn"
              : "các trường có mức độ cạnh tranh tương đối đồng đều"}.
          </p>
          <p>
            <strong>4. Khuyến nghị:</strong> Với {stats?.highly_competitive} trường có tỷ lệ chọi ≥
            2.0, thí sinh nên chuẩn bị nhiều phương án dự phòng và cân nhắc kỹ khả năng của mình
            trước khi chọn nguyện vọng.
          </p>
        </div>
      </div>
    </div>
  );
}
