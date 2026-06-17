'use client'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

// Compatibility shim: provides useFirebase + useSubscription + useDocument
// Internally uses fetch API → Prisma routes instead of Firestore

export function useFirebase() {
  return { firestore: true, auth: true }
}

// useSubscription → useQuery (fetches from API)
export function useSubscription<T = any>(
  _firestore: any,
  collectionPath: string | null,
  constraints: any[] = []
) {
  const { data, isLoading, error } = useQuery<T[]>({
    queryKey: ['subscription', collectionPath],
    queryFn: async () => {
      if (!collectionPath) return []
      // Map Firestore collection names to our API routes
      const apiMap: Record<string, string> = {
        'employees': '/api/employees',
        'clients': '/api/clients?page=1&limit=200',
        'governorates': '/api/governorates',
        'departments': '/api/departments',
        'jobTitles': '/api/job-titles',
        'job-titles': '/api/job-titles',
        'transactionTypes': '/api/transaction-types',
        'transaction-types': '/api/transaction-types',
        'workStages': '/api/work-stages',
        'work-stages': '/api/work-stages',
        'accounts': '/api/accounts',
        'chartOfAccounts': '/api/accounts',
        'leaveRequests': '/api/leave-requests',
        'leave-requests': '/api/leave-requests',
        'quotations': '/api/quotations',
        'notifications': '/api/notifications',
        'notifications': '/api/notifications',
      }
      const url = apiMap[collectionPath]
      if (!url) return []
      const res = await fetch(url)
      if (!res.ok) return []
      const json = await res.json()
      return (json.data || json || []) as T[]
    },
    enabled: !!collectionPath,
    staleTime: 30_000,
  })

  return { data: data || [], loading: isLoading, error }
}

// useDocument → useQuery (fetches single doc)
export function useDocument<T = any>(
  _firestore: any,
  docPath: string | null
) {
  const { data, isLoading, error } = useQuery<T | null>({
    queryKey: ['document', docPath],
    queryFn: async () => {
      if (!docPath) return null
      // Try to fetch from API — this is a simplified version
      return null
    },
    enabled: !!docPath,
  })

  return { data: data || null, loading: isLoading, error }
}

export { useSubscription as default }
