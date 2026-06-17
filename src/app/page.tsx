// This page is intentionally minimal.
// All traffic to '/' is internally rewritten to '/dashboard' via next.config.ts.
// If someone reaches this page directly (rare), show a link to /dashboard.
import Link from 'next/link'
import { Building2 } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#F5820D] to-[#FF8F00] rounded-3xl shadow-xl mb-4">
          <Building2 className="h-10 w-10 text-white" />
        </div>
        <p className="text-stone-500 font-bold mb-4">جاري التحميل...</p>
        <Link href="/dashboard" className="text-[#F5820D] underline font-bold">
          اذهب إلى لوحة التحكم
        </Link>
      </div>
    </div>
  )
}
