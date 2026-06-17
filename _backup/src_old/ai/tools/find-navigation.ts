import Fuse from 'fuse.js';
import { NovaSystemSchema } from '@/lib/nova-system-schema';
function buildNavLinks() {
  const links: any[] = [];
  for (const module of NovaSystemSchema)
    for (const child of module.children)
      links.push({ name: child.label, path: child.href, keywords: [child.label, module.label, child.id] });
  const extra = [
    { name: 'Dashboard', path: '/dashboard', keywords: ['home', 'dashboard', 'الرئيسية'] },
    { name: 'New Client', path: '/dashboard/clients/new', keywords: ['new client', 'عميل جديد'] },
    { name: 'New Quotation', path: '/dashboard/quotations/new', keywords: ['new quote', 'عرض سعر'] },
    { name: 'New Appointment', path: '/dashboard/appointments/new', keywords: ['new appointment', 'حجز موعد'] },
    { name: 'New Employee', path: '/dashboard/hr/employees/new', keywords: ['new employee', 'إضافة موظف'] },
    { name: 'Settings', path: '/dashboard/settings', keywords: ['settings', 'إعدادات'] },
  ];
  const pathSet = new Set(links.map(l => l.path));
  for (const e of extra) if (!pathSet.has(e.path)) { links.push(e); pathSet.add(e.path); }
  return links;
}
const navLinks = buildNavLinks();
const fuse = new Fuse(navLinks, { keys: ['name', 'keywords'], includeScore: true, threshold: 0.4, ignoreLocation: true });
export function findNavigation(query: string): { path: string; name: string } | null {
  if (!query?.trim()) return null;
  const results = fuse.search(query);
  return results.length > 0 ? { path: results[0].item.path, name: results[0].item.name } : null;
}
export function findMultipleNavigations(query: string, limit: number = 5) {
  if (!query?.trim()) return [];
  return fuse.search(query).slice(0, limit).map(r => ({ path: r.item.path, name: r.item.name, score: r.score || 0 }));
}
export { navLinks };
