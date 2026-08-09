import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** Tailwind 클래스 안전하게 합치기 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
