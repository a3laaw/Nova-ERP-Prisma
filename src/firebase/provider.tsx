'use client'
import { ReactNode } from 'react'
export function FirebaseProvider({ children }: { children: ReactNode }) { return <>{children}</> }
export function useFirebase() { return { firestore: true, auth: true } }
export { useSubscription } from './index'
