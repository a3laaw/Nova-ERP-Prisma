'use client'
import { useQuery } from '@tanstack/react-query'

export function useFirebase() { return { firestore: true, auth: true } }

const API_MAP: Record<string, string> = {
  'employees': '/api/employees', 'clients': '/api/clients?page=1&limit=200',
  'governorates': '/api/governorates', 'departments': '/api/departments',
  'jobTitles': '/api/job-titles', 'job-titles': '/api/job-titles',
  'transactionTypes': '/api/transaction-types', 'transaction-types': '/api/transaction-types',
  'workStages': '/api/work-stages', 'work-stages': '/api/work-stages',
  'accounts': '/api/accounts', 'chartOfAccounts': '/api/accounts',
  'leaveRequests': '/api/leave-requests', 'leave-requests': '/api/leave-requests',
  'quotations': '/api/quotations', 'notifications': '/api/notifications',
  'vendors': '/api/vendors', 'items': '/api/items', 'projects': '/api/projects',
  'journalEntries': '/api/journal-entries', 'journal-entries': '/api/journal-entries',
  'cashReceipts': '/api/cash-receipts', 'cash-receipts': '/api/cash-receipts',
  'paymentVouchers': '/api/payment-vouchers', 'payment-vouchers': '/api/payment-vouchers',
  'purchaseOrders': '/api/purchase-orders', 'purchase-orders': '/api/purchase-orders',
  'contracts': '/api/contracts', 'tasks': '/api/tasks', 'appointments': '/api/appointments',
  'custodyItems': '/api/custody', 'custody': '/api/custody',
  'custodyReconciliations': '/api/custody-reconciliations',
  'clientTransactions': '/api/client-transactions', 'transactions': '/api/client-transactions',
}

export function useSubscription<T = any>(_firestore: any, collectionPath: string | null, _constraints: any[] = []) {
  const { data, isLoading, error } = useQuery<T[]>({
    queryKey: ['subscription', collectionPath],
    queryFn: async () => {
      if (!collectionPath) return []
      const url = API_MAP[collectionPath]
      if (!url) { console.warn('No API for:', collectionPath); return [] }
      const res = await fetch(url)
      if (!res.ok) return []
      const json = await res.json()
      return (json.data || json || []) as T[]
    },
    enabled: !!collectionPath, staleTime: 30_000,
  })
  return { data: data || [], loading: isLoading, error }
}

export function useDocument<T = any>(_firestore: any, docPath: string | null) {
  const { data, isLoading, error } = useQuery<T | null>({
    queryKey: ['document', docPath],
    queryFn: async () => { if (!docPath) return null; return null },
    enabled: !!docPath,
  })
  return { data: data || null, loading: isLoading, error }
}

export { useSubscription as default }
