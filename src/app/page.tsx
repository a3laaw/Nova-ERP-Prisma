'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()
  useEffect(() => { router.replace('/dashboard') }, [router])
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#F5820D] to-[#FF8F00] rounded-3xl shadow-xl mb-4 animate-pulse">
          <Building2 className="h-10 w-10 text-white" />
        </div>
        <p className="text-stone-500 font-bold">جاري التحميل...</p>
      </div>
    </div>
  )
}

import { Building2 } from 'lucide-react'
