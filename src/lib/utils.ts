import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number | undefined | null, currency: string = 'KWD'): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) return `${currency} 0.000`;
  return `${currency} ${Number(amount).toLocaleString('en-KW', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`;
}

export function formatNumber(value: number | undefined | null): string {
  if (value === undefined || value === null || isNaN(Number(value))) return '0';
  return Number(value).toLocaleString('en-KW');
}

export function numberToArabicWords(num: number | undefined | null): string {
  if (!num || num === 0) return 'صفر';
  return num.toLocaleString('ar-EG');
}

// Compatibility: getTenantPath (no-op in Prisma)
export function getTenantPath(relativePath: string | null, _tenantId: string | undefined): string | null {
  return relativePath
}

// Compatibility: cleanFirestoreData (no-op in Prisma)
export function cleanFirestoreData(data: any): any {
  const cleaned: { [key: string]: any } = {}
  for (const key in data) {
    const value = data[key]
    if (value === undefined || value === null) continue
    if (key === 'id' || key === 'createdAt') continue
    cleaned[key] = value
  }
  return cleaned
}

// Stubs for v6 compatibility
export function extractMentions(text: string): string[] {
  if (!text) return []
  const matches = text.match(/@[\w\u0600-\u06FF]+/g)
  return matches ? matches : []
}

export function generateStableId(prefix: string = 'id'): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}
