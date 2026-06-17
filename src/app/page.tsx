'use client'

import { useEffect } from 'react'
import { Building2 } from 'lucide-react'

/**
 * Home page — redirects to /dashboard via window.location.href.
 * We use a hard client-side navigation (window.location.href) instead of
 * server-side redirect() or router.replace() to bypass any cached 307
 * responses the browser may have stored from previous broken sessions.
 *
 * This guarantees: even if the browser has a stale 307 cached for "/",
 * it will re-fetch "/" → get this HTML → JS forces navigation to /dashboard.
 */
export default function Home() {
  useEffect(() => {
    // Force a full page navigation to /dashboard.
    // This bypasses any cached redirects and ensures the browser actually
    // requests /dashboard fresh.
    if (typeof window !== 'undefined') {
      window.location.replace('/dashboard')
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#F5820D] to-[#FF8F00] rounded-3xl shadow-xl mb-4 animate-pulse">
          <Building2 className="h-10 w-10 text-white" />
        </div>
        <p className="text-stone-500 font-bold">جاري التحميل...</p>
        <p className="text-stone-400 text-xs mt-2">
          إذا لم يتم تحويلك تلقائياً،{' '}
          <a href="/dashboard" className="text-[#F5820D] underline font-bold">
            اضغط هنا
          </a>
        </p>
      </div>
    </div>
  )
}
