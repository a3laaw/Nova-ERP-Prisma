'use client'
import { ReactNode } from 'react'

export function FirebaseProvider({ children }: { children: ReactNode }) {
  return <>{children}</>
}

// Compatibility: useFirebase returns a dummy object
// Real data fetching happens via useSubscription which calls API routes
export function useFirebase() {
  return { firestore: true, auth: true }
}

// Also export useSubscription for files that import from provider
export { useSubscription } from './index'
