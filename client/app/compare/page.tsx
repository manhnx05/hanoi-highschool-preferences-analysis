"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchSchools } from "@/lib/api";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Search } from "lucide-react";

export default function ComparePage() {
  const [mounted, setMounted] = useState(false);
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredSchools = schools.filter((school) =>
    school.school_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.school_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSchool = (schoolId: string) => {
    if (selectedSchools.includes(schoolId)) {
      setSelectedSchools(selectedSchools.filter((id) => id !== schoolId));
    } else if (selectedSchools.length < 5) {
      setSelectedSchools([...selectedSchools, schoolId]);
    }
  };

  const comparisonData = schools
    .filter((school) => selectedSchools.includes(school.school_id))
    .map((school) => ({
      name: school.school_name.length > 20 
        ? school.school_name.substring(0, 20) + "..." 
        : school.school_name,
      "Tổng HS": school.total_students,
      "NV1": school.nv1,
      "NV2": school.nv2,
      "NV3": school.nv3,
    }));

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">So sánh trường học</h1>
        <p className="text-muted-foreground">
          Chọn tối đa 5 trường để so sánh (đã chọn: {selectedSchools.length}/5)
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* School Selection */}
        <div className="lg:col-span-1">
          <div className="rounded-lg border bg-card p-4">
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Tìm kiếm trường..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border bg-background py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="max-h-[600px] space-y-2 overflow-y-auto">
              {filteredSchools.map((school) => {
                const isSelected = selectedSchools.includes(school.school_id);
                const canSelect = selectedSchools.length < 5 || isSelected;

                return (
                  <button
                    key={school.school_id}
                    onClick={() => toggleSchool(school.school_id)}
                    disabled={!canSelect}
                    className={`w-full rounded-lg border p-3 text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10"
                        : canSelect
                        ? "hover:border-primary hover:bg-accent"
                        : "cursor-not-allowed opacity-50"
                    }`}
                  >
                    <div className="font-semibold">{school.school_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {school.school_id} • {school.total_students.toLocaleString()} HS
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Comparison Chart */}
        <div className="lg:col-span-2">
          {selectedSchools.length === 0 ? (
            <div className="flex h-[600px] items-center justify-center rounded-lg border bg-card">
              <div className="text-center text-muted-foreground">
                <p className="text-lg">Chọn trường để bắt đầu so sánh</p>
              </div>
            </div>
          ) : (
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-xl font-bold">Biểu đồ so sánh</h2>
              <ResponsiveContainer width="100%" height={500}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Tổng HS" fill="#8b5cf6" />
                  <Bar dataKey="NV1" fill="#3b82f6" />
                  <Bar dataKey="NV2" fill="#10b981" />
                  <Bar dataKey="NV3" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
