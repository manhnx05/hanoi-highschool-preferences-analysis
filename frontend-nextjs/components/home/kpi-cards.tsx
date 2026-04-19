"use client";

import { useQuery } from "@tanstack/react-query";
import { schoolsApi } from "@/lib/api";
import { School, FileText, Users, Flame, Scale, Trophy } from "lucide-react";
import { formatNumber, formatRatio } from "@/lib/utils";

export function KPICards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["stats"],
    queryFn: schoolsApi.getStats,
  });

  const { data: schoolsData } = useQuery({
    queryKey: ["schools"],
    queryFn: () => schoolsApi.getAll(),
  });

  if (isLoading || !stats) {
    return (
      <section className="border-y border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse rounded-2xl bg-background p-6">
                <div className="mb-4 h-12 w-12 rounded-xl bg-muted" />
                <div className="mb-2 h-8 w-16 rounded bg-muted" />
                <div className="h-4 w-24 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const topSchool = schoolsData?.data.sort((a, b) => b.ratio - a.ratio)[0];

  const kpis = [
    {
      icon: School,
      label: "Tổng số trường",
      value: stats.total_schools,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      icon: Users,
      label: "Tổng chỉ tiêu",
      value: formatNumber(stats.total_quota),
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      icon: FileText,
      label: "Tổng hồ sơ NV1",
      value: formatNumber(stats.total_nv1),
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
    {
      icon: Flame,
      label: "Tỷ lệ chọi cao nhất",
      value: topSchool ? formatRatio(topSchool.ratio) : "—",
      subtitle: topSchool?.name,
      color: "text-red-500",
      bg: "bg-red-500/10",
    },
    {
      icon: Scale,
      label: "Tỷ lệ chọi TB",
      value: formatRatio(stats.ratio.mean),
      color: "text-amber-500",
      bg: "bg-amber-500/10",
    },
    {
      icon: Trophy,
      label: "Trường cạnh tranh cao (≥2)",
      value: stats.highly_competitive,
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
    },
  ];

  return (
    <section className="border-y border-border bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {kpis.map((kpi, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-2xl bg-background p-6 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 transition-opacity group-hover:opacity-100" />
              
              <div className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl ${kpi.bg}`}>
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>

              <div className="relative">
                <div className="mb-1 font-display text-3xl font-bold">
                  {kpi.value}
                </div>
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {kpi.label}
                </div>
                {kpi.subtitle && (
                  <div className="mt-1 truncate text-xs text-primary">
                    {kpi.subtitle}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
