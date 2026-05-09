import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat("vi-VN").format(num);
}

export function formatRatio(ratio: number): string {
  return ratio.toFixed(2);
}
