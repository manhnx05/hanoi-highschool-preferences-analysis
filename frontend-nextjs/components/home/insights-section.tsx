"use client";

import { useQuery } from "@tanstack/react-query";
import { schoolsApi } from "@/lib/api";
import { formatNumber, formatRatio } from "@/lib/utils";

export function InsightsSection() {
  const { data: stats } = useQuery({
    queryKey: ["stats"],
    queryFn: schoolsApi.getStats,
  });

  const { data: schoolsData } = useQuery({
    queryKey: ["schools"],
    queryFn: () => schoolsApi.getAll(),
  });

  if (!stats || !schoolsData) {
    return null;
  }

  const schools = schoolsData.data;
  const topRatio = schools.sort((a, b) => b.ratio - a.ratio)[0];
  const topNV1 = schools.sort((a, b) => b.nv1 - a.nv1)[0];
  const bottomRatio = schools.sort((a, b) => a.ratio - b.ratio)[0];
  const topQuota = schools.sort((a, b) => b.quota - a.quota)[0];
  const aboveAvg = schools.filter((s) => s.ratio >= stats.ratio.mean).length;

  const insights = [
    {
      icon: "🔥",
      color: "text-red-500",
      bg: "bg-red-500/10",
      title: "Trường cạnh tranh nhất",
      badge: `${formatRatio(topRatio.ratio)}x`,
      text: `${topRatio.name} dẫn đầu với tỷ lệ chọi ${topRatio.ratio}. Mỗi chỉ tiêu có đến ${topRatio.ratio} hồ sơ NV1 cạnh tranh.`,
    },
    {
      icon: "📋",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      title: "Trường nhận nhiều NV1 nhất",
      badge: formatNumber(topNV1.nv1),
      text: `${topNV1.name} thu hút ${formatNumber(topNV1.nv1)} hồ sơ nguyện vọng 1—nhiều nhất toàn thành phố.`,
    },
    {
      icon: "📊",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      title: "Tỷ lệ chọi trung bình",
      badge: `${formatRatio(stats.ratio.mean)}x`,
      text: `Tỷ lệ chọi trung bình là ${formatRatio(stats.ratio.mean)}. Có ${aboveAvg}/${schools.length} trường cao hơn mức này.`,
    },
    {
      icon: "✅",
      color: "text-green-500",
      bg: "bg-green-500/10",
      title: "Trường ít cạnh tranh nhất",
      badge: `${formatRatio(bottomRatio.ratio)}x`,
      text: `${bottomRatio.name} có tỷ lệ chọi thấp nhất (${bottomRatio.ratio}). Còn nhiều cơ hội cho thí sinh.`,
    },
    {
      icon: "🏫",
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      title: "Trường có chỉ tiêu cao nhất",
      badge: formatNumber(topQuota.quota),
      text: `${topQuota.name} tuyển nhiều nhất với ${formatNumber(topQuota.quota)} chỉ tiêu — tạo nhiều cơ hội nhất cho học sinh.`,
    },
    {
      icon: "📈",
      color: "text-cyan-500",
      bg: "bg-cyan-500/10",
      title: "Tổng hồ sơ dịch chuyển",
      badge: formatNumber(stats.total_aspirations),
      text: `Tổng cộng ${formatNumber(stats.total_aspirations)} lượt nộp hồ sơ (NV1+NV2+NV3), tương đương ${stats.nv1_vs_quota_ratio}x chỉ tiêu.`,
    },
  ];

  return (
    <section id="insights" className="border-y border-border bg-card py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="mb-2 font-display text-3xl font-bold">
            💡 Insights & Phân tích
          </h2>
          <p className="text-muted-foreground">
            Những điểm nổi bật được rút ra từ dữ liệu
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="group rounded-2xl border border-border bg-background p-6 transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex items-start gap-4">
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl text-2xl ${insight.bg}`}>
                  {insight.icon}
                </div>
                <div className="flex-1">
                  <div className={`mb-1 font-display text-2xl font-bold ${insight.color}`}>
                    {insight.badge}
                  </div>
                  <div className="mb-2 font-semibold">{insight.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {insight.text}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
