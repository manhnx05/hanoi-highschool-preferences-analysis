"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { schoolsApi } from "@/lib/api";
import { formatNumber, formatRatio, cn } from "@/lib/utils";
import { Search, ArrowUpDown } from "lucide-react";
import Link from "next/link";

export function DataTableSection() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("ratio");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const { data, isLoading } = useQuery({
    queryKey: ["schools", search, sortBy, sortDir],
    queryFn: () =>
      schoolsApi.getAll({
        name: search,
        sort_by: sortBy,
        sort_dir: sortDir,
      }),
  });

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortDir("desc");
    }
  };

  return (
    <section id="database" className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h2 className="mb-2 font-display text-3xl font-bold">
            🗄️ Cơ sở Dữ liệu Đầy đủ
          </h2>
          <p className="text-muted-foreground">
            Tìm kiếm, lọc và sắp xếp toàn bộ 120 trường THPT
          </p>
        </div>

        {/* Search */}
        <div className="mb-6 rounded-2xl border border-border bg-card p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm theo tên trường... VD: Phan Đình Phùng"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-border bg-background py-3 pl-10 pr-4 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  {[
                    { key: "tt", label: "#" },
                    { key: "name", label: "Trường THPT" },
                    { key: "quota", label: "Chỉ tiêu" },
                    { key: "nv1", label: "NV 1" },
                    { key: "nv2", label: "NV 2" },
                    { key: "nv3", label: "NV 3" },
                    { key: "total", label: "Tổng HS" },
                    { key: "ratio", label: "Tỷ lệ chọi" },
                  ].map((col) => (
                    <th
                      key={col.key}
                      className="cursor-pointer px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground"
                      onClick={() => handleSort(col.key)}
                    >
                      <div className="flex items-center gap-2">
                        {col.label}
                        <ArrowUpDown className="h-3 w-3" />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                    </td>
                  </tr>
                ) : data?.data.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-muted-foreground">
                      Không tìm thấy kết quả
                    </td>
                  </tr>
                ) : (
                  data?.data.map((school, index) => (
                    <tr
                      key={school.tt}
                      className="border-t border-border transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-3">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-muted text-sm font-medium">
                          {index + 1}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/school/${school.tt}`}
                          className="font-medium hover:text-primary hover:underline"
                        >
                          {school.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3">{formatNumber(school.quota)}</td>
                      <td className="px-4 py-3">{formatNumber(school.nv1)}</td>
                      <td className="px-4 py-3">{formatNumber(school.nv2)}</td>
                      <td className="px-4 py-3">{formatNumber(school.nv3)}</td>
                      <td className="px-4 py-3">{formatNumber(school.total)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "font-bold",
                            school.ratio >= 2.5 && "text-red-500",
                            school.ratio >= 1.75 && school.ratio < 2.5 && "text-amber-500",
                            school.ratio >= 1.25 && school.ratio < 1.75 && "text-green-500",
                            school.ratio < 1.25 && "text-muted-foreground"
                          )}
                        >
                          {formatRatio(school.ratio)}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {data && data.count > 0 && (
            <div className="border-t border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
              Hiển thị <span className="font-semibold text-foreground">{data.count}</span> trường
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
