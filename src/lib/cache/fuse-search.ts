import Fuse from 'fuse.js';
function search<T>(items: T[], query: string, keys: (keyof T | string)[], threshold: number = 0.3): T[] {
  if (!Array.isArray(items) || items.length === 0) return [];
  if (!query || !query.trim()) return items;
  const fuse = new Fuse(items, { keys: keys as string[], threshold, includeScore: true, minMatchCharLength: 2, ignoreLocation: true });
  return fuse.search(query).map(r => r.item);
}
export const searchClients = (items: any[], query: string) => search(items, query, ['nameAr', 'nameEn', 'fileId', 'mobile'], 0.4);
export const searchEmployees = (items: any[], query: string) => search(items, query, ['fullName', 'employeeNumber', 'civilId'], 0.4);
export const searchAccounts = (items: any[], query: string) => search(items, query, ['name', 'code', 'nameAr'], 0.3);
export const searchJournalEntries = (items: any[], query: string) => search(items, query, ['entryNumber', 'description', 'narration', 'reference'], 0.4);
export const searchCashReceipts = (items: any[], query: string) => search(items, query, ['receiptNumber', 'clientNameAr', 'amount'], 0.4);
export const searchPaymentVouchers = (items: any[], query: string) => search(items, query, ['voucherNumber', 'payeeName', 'amount'], 0.4);
export const searchQuotations = (items: any[], query: string) => search(items, query, ['quotationNumber', 'clientName', 'subject'], 0.4);
export const searchPurchaseOrders = (items: any[], query: string) => search(items, query, ['poNumber', 'vendorName'], 0.4);
export const searchItems = (items: any[], query: string) => search(items, query, ['name', 'nameAr', 'sku', 'description', 'categoryName'], 0.4);
export const searchVendors = (items: any[], query: string) => search(items, query, ['name', 'nameAr', 'contactPerson', 'phone', 'email'], 0.4);
export const searchRfqs = (items: any[], query: string) => search(items, query, ['rfqNumber', 'status', 'subject'], 0.4);
export const searchGeneric = <T>(items: T[], query: string, keys: (keyof T | string)[], threshold: number = 0.3) => search(items, query, keys, threshold);
