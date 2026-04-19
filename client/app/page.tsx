import { HeroSection } from "@/components/home/hero-section";
import { KPICards } from "@/components/home/kpi-cards";
import { ChartsSection } from "@/components/home/charts-section";
import { InsightsSection } from "@/components/home/insights-section";
import { DataTableSection } from "@/components/home/data-table-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <KPICards />
      <ChartsSection />
      <InsightsSection />
      <DataTableSection />
    </>
  );
}
