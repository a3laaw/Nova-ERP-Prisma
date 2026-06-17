'use client'
import { useQuery } from '@tanstack/react-query'

// Stub hook — compatibility for v6 components that imported useSubscription from @/hooks/use-subscription
export function useSubscription<T = any>(collectionPath: string | null, _constraints: any[] = []) {
  const { data, isLoading, error } = useQuery<T[]>({
    queryKey: ['subscription', collectionPath],
    queryFn: async () => {
      if (!collectionPath) return []
      return [] as T[]
    },
    enabled: !!collectionPath,
    staleTime: 30_000,
  })
  return { data: data || [], loading: isLoading, error }
}

export default useSubscription
