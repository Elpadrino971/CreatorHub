import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format large numbers (e.g., 1500 -> 1.5K, 1500000 -> 1.5M)
export function formatNumber(num: number): string {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1) + 'B'
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// Format currency
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

// Calculate percentage change
export function calculatePercentageChange(current: number, previous: number): number {
  if (previous === 0) return 100
  return ((current - previous) / previous) * 100
}

// Format date ranges
export function formatDateRange(start: Date, end: Date): string {
  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  })
  return `${formatter.format(start)} - ${formatter.format(end)}`
}
