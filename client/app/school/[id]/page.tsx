"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { schoolsApi } from "@/lib/api";
import {
  ArrowLeft,
  Users,
  Target,
  TrendingUp,
  Award,
  BarChart3,
  School as SchoolIcon,
} from "lucide-react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Link from "next/link";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

export default function SchoolDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const schoolId = parseInt(params.id as string);

  const { data: schoolDetail, isLoading } = useQuery({
    queryKey: ["school-detail", schoolId],
    queryFn: () => schoolsApi.getSchoolDetail(schoolId),
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-4 text-muted-foreground">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  if (!schoolDetail) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-lg text-muted-foreground">Không tìm thấy trường</p>
          <Link
            href="/"
            className="mt-4 inline-flex items-center gap-2 text-primary hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    );
  }

  const { school, statistics, rankings, nv_distribution, similar_schools, city_comparison } =
    schoolDetail;

  // Data for charts
  const nvData = [
    { name: "NV1", value: school.nv1, percent: nv_distribution.nv1_percent },
    { name: "NV2", value: school.nv2, percent: nv_distribution.nv2_percent },
    { name: "NV3", value: school.nv3, percent: nv_distribution.nv3_percent },
  ];

  const comparisonData = [
    {
      category: "Tỷ lệ chọi",
      "Trường này": school.ratio,
      "TB thành phố": city_comparison.avg_ratio,
    },
    {
      category: "Chỉ tiêu",
      "Trường này": school.quota,
      "TB thành phố": city_comparison.avg_quota,
    },
    {
      category: "NV1",
      "Trường này": school.nv1,
      "TB thành phố": city_comparison.avg_nv1,
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back Button */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại
      </Link>

      {/* School Header */}
      <div className="mb-8 rounded-2xl border bg-card p-8">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <SchoolIcon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{school.name}</h1>
                <p className="text-muted-foreground">Mã trường: {school.tt}</p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <div
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold"
              style={{
                backgroundColor: `${statistics.tier_color}20`,
                color: statistics.tier_color,
              }}
            >
              <Award className="h-4 w-4" />
              Mức độ: {statistics.tier}
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Chỉ tiêu</p>
              <p className="text-3xl font-bold">{school.quota.toLocaleString()}</p>
            </div>
            <Target className="h-10 w-10 text-blue-500" />
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng học sinh</p>
              <p className="text-3xl font-bold">{school.total.toLocaleString()}</p>
            </div>
            <Users className="h-10 w-10 text-green-500" />
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tỷ lệ chọi</p>
              <p className="text-3xl font-bold">{school.ratio.toFixed(2)}</p>
            </div>
            <TrendingUp className="h-10 w-10 text-amber-500" />
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Xếp hạng</p>
              <p className="text-3xl font-bold">#{rankings.by_ratio}</p>
            </div>
            <Award className="h-10 w-10 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <BarChart3 className="h-5 w-5 text-primary" />
            Thống kê
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phân vị:</span>
              <span className="font-semibold">{statistics.percentile}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Z-score:</span>
              <span className="font-semibold">{statistics.z_score}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Mức độ cạnh tranh:</span>
              <span
                className="font-semibold"
                style={{ color: statistics.tier_color }}
              >
                {statistics.tier}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Award className="h-5 w-5 text-primary" />
            Xếp hạng
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Theo tỷ lệ chọi:</span>
              <span className="font-semibold">#{rankings.by_ratio}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Theo NV1:</span>
              <span className="font-semibold">#{rankings.by_nv1}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Theo chỉ tiêu:</span>
              <span className="font-semibold">#{rankings.by_quota}</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <Users className="h-5 w-5 text-primary" />
            Nguyện vọng
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">NV1:</span>
              <span className="font-semibold">
                {school.nv1.toLocaleString()} ({nv_distribution.nv1_percent}%)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">NV2:</span>
              <span className="font-semibold">
                {school.nv2.toLocaleString()} ({nv_distribution.nv2_percent}%)
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">NV3:</span>
              <span className="font-semibold">
                {school.nv3.toLocaleString()} ({nv_distribution.nv3_percent}%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="mb-8 grid gap-6 lg:grid-cols-2">
        {/* NV Distribution Pie Chart */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Phân bổ nguyện vọng</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={nvData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${percent}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {nvData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Comparison Bar Chart */}
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">So sánh với trung bình TP</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Trường này" fill="#3b82f6" />
              <Bar dataKey="TB thành phố" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Similar Schools */}
      {similar_schools && similar_schools.length > 0 && (
        <div className="rounded-xl border bg-card p-6">
          <h3 className="mb-4 text-lg font-semibold">Trường tương tự</h3>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {similar_schools.map((similar) => (
              <Link
                key={similar.tt}
                href={`/school/${similar.tt}`}
                className="rounded-lg border p-4 transition-all hover:border-primary hover:bg-accent"
              >
                <div className="font-semibold">{similar.name}</div>
                <div className="text-sm text-muted-foreground">
                  Tỷ lệ chọi: {similar.ratio.toFixed(2)}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
