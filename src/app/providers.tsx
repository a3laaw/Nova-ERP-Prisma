'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { SessionProvider } from 'next-auth/react'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import { SyncStatusProvider } from '@/context/sync-context'
import { useState, ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: { queries: { staleTime: 30_000, retry: 1 } }
  }))
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="light">
        <SyncStatusProvider>
          <QueryClientProvider client={queryClient}>
            {children}
            <Toaster position="top-center" richColors />
          </QueryClientProvider>
        </SyncStatusProvider>
      </ThemeProvider>
    </SessionProvider>
  )
}
