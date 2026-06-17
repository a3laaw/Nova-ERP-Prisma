export function onAuthStateChanged(_auth: any, _cb: any) { return () => {} }
export function signInWithEmailAndPassword(_auth: any, _email: string, _pass: string) { return Promise.resolve({ user: { uid: 'stub' } }) }
export function signOut(_auth: any) { return Promise.resolve() }
export function sendPasswordResetEmail(_auth: any, _email: string) { return Promise.resolve() }
export function getIdToken(_user: any, _force?: boolean) { return Promise.resolve('stub-token') }
export function getIdTokenResult(_user: any, _force?: boolean) { return Promise.resolve({ claims: {} }) }
export type User = any
export type Auth = any
