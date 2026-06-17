// Stub: provides empty implementations of firebase/firestore functions
// All actual data fetching goes through useSubscription (which uses fetch API)

export const serverTimestamp = () => new Date().toISOString()
export const Timestamp = { now: () => ({ seconds: Date.now() / 1000, nanoseconds: 0 }), fromDate: (d: Date) => ({ seconds: d.getTime() / 1000, nanoseconds: 0 }) }

export function collection(_db: any, _path: string) { return {} }
export function doc(_db: any, _path: string) { return {} }
export function query(_coll: any, ..._constraints: any[]) { return {} }
export function where(_field: string, _op: string, _value: any) { return {} }
export function orderBy(_field: string, _dir?: string) { return {} }
export function limit(_n: number) { return {} }
export function startAfter(_doc: any) { return {} }
export function getDocs(_q: any) { return Promise.resolve({ docs: [], empty: true, forEach: () => {} }) }
export function getDoc(_ref: any) { return Promise.resolve({ exists: () => false, data: () => ({}), id: '' }) }
export function addDoc(_coll: any, _data: any) { return Promise.resolve({ id: Date.now().toString() }) }
export function setDoc(_ref: any, _data: any, _opts?: any) { return Promise.resolve() }
export function updateDoc(_ref: any, _data: any) { return Promise.resolve() }
export function deleteDoc(_ref: any) { return Promise.resolve() }
export function runTransaction(_db: any, _fn: any) { return Promise.resolve() }
export function writeBatch(_db: any) { return { set: () => {}, update: () => {}, delete: () => {}, commit: () => Promise.resolve() } }
export function onSnapshot(_q: any, _cb: any, _errCb?: any) { return () => {} }
export function collectionGroup(_db: any, _name: string) { return {} }
export function increment(n: number) { return n }
export type Firestore = any
export type DocumentSnapshot = any
export type QueryConstraint = any
