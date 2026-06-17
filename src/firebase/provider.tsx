'use client'
import { ReactNode } from 'react'
import { useAuth } from '@/context/auth-context'

export function FirebaseProvider({ children }: { children: ReactNode }) { return <>{children}</> }
export function useFirebase() {
  const { user } = useAuth()
  return { firestore: true, auth: true, user, loading: false }
}
export { useSubscription } from './index'
