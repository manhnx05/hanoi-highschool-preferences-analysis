export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <div>
            <p className="font-display text-lg font-bold">
              <span className="gradient-text">EduData</span> Analytics
            </p>
            <p className="text-sm text-muted-foreground">
              Phân tích dữ liệu tuyển sinh THPT Hà Nội 2024–2025
            </p>
          </div>
          <div className="text-center text-sm text-muted-foreground md:text-right">
            <p>Data source: Sở GD&ĐT Hà Nội</p>
            <p>Built with Next.js 14 + FastAPI + Pandas</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
