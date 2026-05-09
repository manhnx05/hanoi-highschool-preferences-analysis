"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Moon, Sun, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Tổng quan", icon: "🏠" },
  { href: "/rankings", label: "Xếp hạng", icon: "🏆" },
  { href: "/compare", label: "So sánh", icon: "⚖️" },
  { href: "/analytics", label: "Phân tích", icon: "📊" },
  { href: "/insights", label: "Data Science", icon: "🧠" },
];

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary shadow-lg">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <span className="font-display text-xl font-bold">
            EduData <span className="gradient-text">Analytics</span>
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <span className="mr-1">{item.icon}</span>
              {item.label}
            </Link>
          ))}

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="ml-2 rounded-lg p-2 hover:bg-accent"
            aria-label="Toggle theme"
          >
            {mounted ? (
              theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )
            ) : (
              <div className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
