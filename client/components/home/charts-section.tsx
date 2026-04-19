"use client";

import { useQuery } from "@tanstack/react-query";
import { schoolsApi } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444"];

export function ChartsSection() {
  const { data: topSchools } = useQuery({
    queryKey: ["top-schools"],
    queryFn: () => schoolsApi.getTop("ratio", 10),
  });

  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: schoolsApi.getStats,
  });

  if (!topSchools || !stats) {
    return (
      <section id="charts" className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="mb-2 font-display text-3xl font-bold">
              📊 Biểu đồ phân tích
            </h2>
            <p className="text-muted-foreground">
              Tổng hợp nhiều góc nhìn về dữ liệu tuyển sinh
            </p>
          </div>
          <div className="h-96 animate-pulse rounded-2xl bg-card" />
        </div>
      </section>
    );
  }

  const chartData = topSchools.map((school) => ({
    name: school.name.length > 20 ? school.name.slice(0, 20) + "..." : school.name,
    ratio: school.ratio,
    nv1: school.nv1,
  }));

  const pieData = [
    { name: "NV 1", value: stats.total_nv1 },
    { name: "NV 2", value: stats.total_nv2 },
    { name: "NV 3", value: stats.total_nv3 },
  ];

  return (
    <section id="charts" className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="mb-2 font-display text-3xl font-bold">
            📊 Biểu đồ phân tích
          </h2>
          <p className="text-muted-foreground">
            Tổng hợp nhiều góc nhìn về dữ liệu tuyển sinh
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Top 10 Competitive Schools */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-4 font-display text-xl font-semibold">
              🔥 Top 10 Trường Cạnh Tranh Nhất
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={150}
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "12px" }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="ratio" fill="#3b82f6" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* NV Distribution Pie */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-4 font-display text-xl font-semibold">
              📈 Phân bổ Nguyện Vọng
            </h3>
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
}
