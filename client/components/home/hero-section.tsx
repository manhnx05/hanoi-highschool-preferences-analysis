"use client";

import Link from "next/link";
import { TrendingUp, Trophy, Scale } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-card py-20">
      {/* Animated background glows */}
      <div className="absolute left-0 top-0 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-3xl" />
      <div className="absolute bottom-0 right-0 h-96 w-96 translate-x-1/2 translate-y-1/2 rounded-full bg-secondary/20 blur-3xl" />

      <div className="container relative mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
            <TrendingUp className="h-4 w-4" />
            Phân tích dữ liệu giáo dục
          </div>

          <h1 className="mb-6 font-display text-5xl font-bold leading-tight md:text-6xl">
            Tuyển sinh THPT
            <br />
            <span className="gradient-text">Hà Nội 2024–2025</span>
          </h1>

          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Phân tích toàn diện dữ liệu tuyển sinh lớp 10 của{" "}
            <strong className="text-foreground">120 trường THPT công lập</strong> tại Hà Nội
            — bao gồm chỉ tiêu, nguyện vọng và tỷ lệ chọi theo từng trường.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="#charts"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-3 font-semibold text-white shadow-lg transition-transform hover:scale-105"
            >
              <TrendingUp className="h-5 w-5" />
              Xem biểu đồ
            </Link>
            <Link
              href="/rankings"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 font-semibold transition-colors hover:bg-accent"
            >
              <Trophy className="h-5 w-5" />
              Xếp hạng Top 20
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-6 py-3 font-semibold transition-colors hover:bg-accent"
            >
              <Scale className="h-5 w-5" />
              So sánh trường
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
