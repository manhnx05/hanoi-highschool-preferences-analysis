"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSchools } from "@/lib/api";
import { Trophy, Medal, Award, TrendingUp, TrendingDown } from "lucide-react";

export default function RankingsPage() {
  const [mounted, setMounted] = useState(false);
  const { data: schools = [], isLoading } = useQuery({
    queryKey: ["schools"],
    queryFn: fetchSchools,
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

  // Sort schools by total students (descending)
  const rankedSchools = [...schools].sort(
    (a, b) => b.total_students - a.total_students
  );

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />;
    if (rank === 3) return <Award className="h-6 w-6 text-amber-600" />;
    return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Xếp hạng trường học</h1>
        <p className="text-muted-foreground">
          Xếp hạng các trường theo tổng số học sinh
        </p>
      </div>

      <div className="space-y-4">
        {rankedSchools.map((school, index) => {
          const rank = index + 1;
          const isTopThree = rank <= 3;

          return (
            <div
              key={school.school_id}
              className={`rounded-lg border p-4 transition-all hover:shadow-md ${
                isTopThree ? "border-primary bg-primary/5" : "bg-card"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="flex w-16 items-center justify-center">
                  {getRankIcon(rank)}
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{school.school_name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Mã: {school.school_id}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {school.total_students.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Tổng HS
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {school.nv1.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">NV1</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {school.nv2.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">NV2</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {school.nv1 > school.nv2 ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
