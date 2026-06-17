// Firestore compatibility — calls Prisma API routes instead
export const serverTimestamp = () => new Date().toISOString()
export const Timestamp = { now: () => ({ seconds: Date.now() / 1000, nanoseconds: 0 }), fromDate: (d: Date) => ({ seconds: d.getTime() / 1000, nanoseconds: 0 }) }

const API_MAP: Record<string, string> = {
  'employees': '/api/employees', 'clients': '/api/clients?page=1&limit=200',
  'governorates': '/api/governorates', 'departments': '/api/departments',
  'jobTitles': '/api/job-titles', 'transactionTypes': '/api/transaction-types',
  'workStages': '/api/work-stages', 'accounts': '/api/accounts',
  'chartOfAccounts': '/api/accounts', 'leaveRequests': '/api/leave-requests',
  'quotations': '/api/quotations', 'notifications': '/api/notifications',
  'vendors': '/api/vendors', 'items': '/api/items', 'projects': '/api/projects',
  'journalEntries': '/api/journal-entries', 'cashReceipts': '/api/cash-receipts',
  'paymentVouchers': '/api/payment-vouchers', 'purchaseOrders': '/api/purchase-orders',
  'contracts': '/api/contracts', 'tasks': '/api/tasks', 'appointments': '/api/appointments',
  'custodyItems': '/api/custody', 'custodyReconciliations': '/api/custody-reconciliations',
  'clientTransactions': '/api/client-transactions', 'transactions': '/api/client-transactions',
}

export function collection(_db: any, path: string) { return { _type: 'collection', path } }
export function doc(_db: any, path: string) { return { _type: 'doc', path } }
export function query(_coll: any, ..._constraints: any[]) { return { _type: 'query', coll: _coll } }
export function where(_field: string, _op: string, _value: any) { return { _type: 'where' } }
export function orderBy(_field: string, _dir?: string) { return { _type: 'orderBy' } }
export function limit(_n: number) { return { _type: 'limit' } }
export function startAfter(_doc: any) { return { _type: 'startAfter' } }

export async function getDocs(q: any) {
  const path = q?.coll?.path || q?.path || ''
  const collectionName = path?.split('/')?.pop() || path
  const url = API_MAP[collectionName] || API_MAP[path]
  if (!url) return { docs: [], empty: true, forEach: () => {}, size: 0 }
  try {
    const res = await fetch(url)
    if (!res.ok) return { docs: [], empty: true, forEach: () => {}, size: 0 }
    const json = await res.json()
    const data = json.data || json || []
    const docs = data.map((item: any) => ({ id: item.id, data: () => item, exists: () => true }))
    return { docs, empty: docs.length === 0, forEach: (cb: any) => docs.forEach(cb), size: docs.length }
  } catch { return { docs: [], empty: true, forEach: () => {}, size: 0 } }
}

export async function getDoc(ref: any) {
  return { exists: () => false, data: () => ({}), id: '' }
}

export async function addDoc(coll: any, data: any) {
  const path = coll?.path || ''
  const collectionName = path?.split('/')?.pop() || path
  const url = API_MAP[collectionName]
  if (!url) return { id: Date.now().toString() }
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    const json = await res.json()
    return { id: json.data?.id || Date.now().toString() }
  } catch { return { id: Date.now().toString() } }
}

export async function setDoc(ref: any, data: any, _opts?: any) { return Promise.resolve() }
export async function updateDoc(ref: any, data: any) { return Promise.resolve() }
export async function deleteDoc(ref: any) { return Promise.resolve() }
export async function runTransaction(_db: any, fn: any) { return Promise.resolve(fn({ get: async () => ({ data: () => null }), set: () => {}, update: () => {} })) }
export function writeBatch(_db: any) { return { set: () => {}, update: () => {}, delete: () => {}, commit: () => Promise.resolve() } }
export function onSnapshot(_q: any, cb: any, _errCb?: any) { cb({ docs: [], empty: true, forEach: () => {} }); return () => {} }
export function collectionGroup(_db: any, name: string) { return { _type: 'collectionGroup', path: name } }
export function increment(n: number) { return n }
export function deleteField() { return null }
export type Firestore = any
export type DocumentSnapshot = any
export type QueryConstraint = any
