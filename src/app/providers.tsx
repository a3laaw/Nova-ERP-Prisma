'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { SyncStatusProvider } from '@/context/sync-context'
import { AuthProvider } from '@/context/auth-context'
import { useState, ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 30_000, retry: 1 } }
  }))
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <SyncStatusProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            {children}
            <Toaster position="top-center" richColors />
          </QueryClientProvider>
        </AuthProvider>
      </SyncStatusProvider>
    </ThemeProvider>
  )
}
