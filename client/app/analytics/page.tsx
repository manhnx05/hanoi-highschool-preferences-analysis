"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { schoolsApi } from "@/lib/api";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
import { TrendingUp, Users, School, BarChart3 } from "lucide-react";

const COLORS = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  const { data: response, isLoading } = useQuery({
    queryKey: ["schools"],
    queryFn: () => schoolsApi.getAll(),
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
        <div className="text-center">Đang tải dữ liệu...</div>
      </div>
    );
  }

  const schools = response?.data || [];

  // Calculate statistics
  const totalStudents = schools.reduce((sum, s) => sum + s.total, 0);
  const totalNV1 = schools.reduce((sum, s) => sum + s.nv1, 0);
  const totalNV2 = schools.reduce((sum, s) => sum + s.nv2, 0);
  const totalNV3 = schools.reduce((sum, s) => sum + s.nv3, 0);
  const avgStudents = Math.round(totalStudents / schools.length);

  // Distribution by preference
  const preferenceData = [
    { name: "NV1", value: totalNV1, percentage: ((totalNV1 / totalStudents) * 100).toFixed(1) },
    { name: "NV2", value: totalNV2, percentage: ((totalNV2 / totalStudents) * 100).toFixed(1) },
    { name: "NV3", value: totalNV3, percentage: ((totalNV3 / totalStudents) * 100).toFixed(1) },
  ];

  // Top 10 schools by total students
  const top10Schools = [...schools]
    .sort((a, b) => b.total - a.total)
    .slice(0, 10)
    .map((s) => ({
      name: s.name.length > 15 ? s.name.substring(0, 15) + "..." : s.name,
      students: s.total,
    }));

  // Distribution by school size
  const sizeDistribution = [
    { range: "< 500", count: schools.filter((s) => s.total < 500).length },
    { range: "500-1000", count: schools.filter((s) => s.total >= 500 && s.total < 1000).length },
    { range: "1000-1500", count: schools.filter((s) => s.total >= 1000 && s.total < 1500).length },
    { range: "1500-2000", count: schools.filter((s) => s.total >= 1500 && s.total < 2000).length },
    { range: "> 2000", count: schools.filter((s) => s.total >= 2000).length },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Phân tích dữ liệu</h1>
        <p className="text-muted-foreground">
          Phân tích chi tiết về phân bổ học sinh và nguyện vọng
        </p>
      </div>

      {/* Summary Cards */}
      <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tổng học sinh</p>
              <p className="text-2xl font-bold">{totalStudents.toLocaleString()}</p>
            </div>
            <Users className="h-8 w-8 text-primary" />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Số trường</p>
              <p className="text-2xl font-bold">{schools.length}</p>
            </div>
            <School className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">TB HS/trường</p>
              <p className="text-2xl font-bold">{avgStudents.toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tỷ lệ NV1</p>
              <p className="text-2xl font-bold">
                {((totalNV1 / totalStudents) * 100).toFixed(1)}%
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-amber-600" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Preference Distribution Pie Chart */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-xl font-bold">Phân bổ theo nguyện vọng</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={preferenceData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}: ${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {preferenceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* School Size Distribution */}
        <div className="rounded-lg border bg-card p-6">
          <h2 className="mb-4 text-xl font-bold">Phân bổ theo quy mô</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sizeDistribution}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top 10 Schools */}
        <div className="rounded-lg border bg-card p-6 lg:col-span-2">
          <h2 className="mb-4 text-xl font-bold">Top 10 trường có nhiều học sinh nhất</h2>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={top10Schools} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip />
              <Bar dataKey="students" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
