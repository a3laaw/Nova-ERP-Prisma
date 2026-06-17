'use client'

import { useState } from 'react'
import { useSession, signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, LogIn, Building2, AlertCircle } from 'lucide-react'

export default function Home() {
  const { data: session, status } = useSession()
  const [email, setEmail] = useState('admin@nova-erp.com')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // إذا مسجل دخول → اعرض زر للذهاب لـ dashboard
  if (status === 'loading') {
    return <div className="min-h-screen flex items-center justify-center bg-stone-50"><Loader2 className="h-8 w-8 animate-spin text-[#F5820D]" /></div>
  }

  if (session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50 p-4" dir="rtl">
        <Card className="w-full max-w-md rounded-3xl border shadow-xl bg-white/95">
          <CardHeader className="text-center pb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#F5820D] to-[#FF8F00] rounded-2xl shadow-lg mb-4 mx-auto">
              <Building2 className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl font-black text-stone-800">أهلاً بك</CardTitle>
            <CardDescription className="text-stone-500">{session.user?.name || session.user?.email}</CardDescription>
          </CardHeader>
          <CardContent>
            <a href="/dashboard">
              <Button className="w-full h-12 rounded-xl font-black text-lg gap-2 bg-gradient-to-r from-[#F5820D] to-[#FF8F00] text-white shadow-lg">
                <LogIn className="h-5 w-5" /> متابعة إلى لوحة التحكم
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', { email, password, redirect: false })
      if (result?.error) {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
        setLoading(false)
      } else {
        // إعادة تحميل الصفحة (ستعرض زر "متابعة")
        window.location.reload()
      }
    } catch {
      setError('حدث خطأ. حاول مرة أخرى.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-stone-100 p-4" dir="rtl">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#F5820D] to-[#FF8F00] rounded-3xl shadow-xl mb-4">
            <Building2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-stone-800">Nova ERP</h1>
          <p className="text-stone-500 text-sm mt-2">نظام إدارة موارد المؤسسات للسوق الكويتي</p>
        </div>

        <Card className="rounded-3xl border border-stone-200 shadow-xl bg-white/95 backdrop-blur">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-black text-center text-stone-800">تسجيل الدخول</CardTitle>
            <CardDescription className="text-center text-stone-500">أدخل بياناتك للوصول إلى لوحة التحكم</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-3 flex items-center gap-2 text-red-700 text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="space-y-2">
                <Label className="font-bold text-stone-700">البريد الإلكتروني</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-xl border-2 border-stone-200 focus:border-[#F5820D]" placeholder="admin@nova-erp.com" required disabled={loading} />
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-stone-700">كلمة المرور</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-xl border-2 border-stone-200 focus:border-[#F5820D]" placeholder="••••••••" required disabled={loading} />
              </div>

              <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl font-black text-lg gap-2 bg-gradient-to-r from-[#F5820D] to-[#FF8F00] hover:from-[#C45600] hover:to-[#F5820D] text-white shadow-lg">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
                {loading ? 'جاري الدخول...' : 'دخول'}
              </Button>
            </form>

            <div className="mt-6 p-4 bg-stone-50 rounded-2xl border border-stone-100">
              <p className="text-xs text-stone-500 font-bold text-center mb-2">بيانات تجريبية</p>
              <div className="flex justify-center gap-4 text-xs text-stone-600">
                <span className="font-mono bg-white px-2 py-1 rounded border">admin@nova-erp.com</span>
                <span className="font-mono bg-white px-2 py-1 rounded border">admin123</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-stone-400 mt-6">Nova ERP v1.0 — Prisma + NextAuth</p>
      </div>
    </div>
  )
}
