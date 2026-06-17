export function toDateSafe(value: any): Date | null {
  try {
    if (!value) return null;
    if (value instanceof Date) return isNaN(value.getTime()) ? null : value;
    if (value && typeof value.toDate === 'function') return value.toDate();
    if (typeof value === 'object' && 'seconds' in value) return new Date(value.seconds * 1000);
    if (typeof value === 'string') { const d = new Date(value); return isNaN(d.getTime()) ? null : d; }
    if (typeof value === 'number') { const d = new Date(value); return isNaN(d.getTime()) ? null : d; }
    return null;
  } catch { return null; }
}
export function toDateString(dateValue: any): string {
  const date = toDateSafe(dateValue);
  if (!date) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function toISODate(dateValue: any): string | null {
  const date = toDateSafe(dateValue);
  return date ? date.toISOString() : null;
}
export function toStartOfDay(dateValue: any): Date | null {
  const date = toDateSafe(dateValue);
  if (!date) return null;
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
