'use client'

import { useState } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Loader2, LogIn, LogOut, Building2, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [email, setEmail] = useState('admin@nova-erp.com')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#F5820D]" />
      </div>
    )
  }

  // إذا مسجل دخول → redirect لـ /dashboard
  if (session) {
    router.push('/dashboard')
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#F5820D]" />
      </div>
    )
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
        setLoading(false)
      } else {
        // نجح الدخول — إعادة تحميل الصفحة
        window.location.href = '/dashboard'
      }
    } catch {
      setError('حدث خطأ. حاول مرة أخرى.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-stone-100 p-4" dir="rtl">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#F5820D] to-[#FF8F00] rounded-3xl shadow-xl mb-4">
            <Building2 className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-stone-800">Nova ERP</h1>
          <p className="text-stone-500 text-sm mt-2">نظام إدارة موارد المؤسسات للسوق الكويتي</p>
        </div>

        {/* Login Card */}
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
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-12 rounded-xl border-2 border-stone-200 focus:border-[#F5820D]"
                  placeholder="admin@nova-erp.com"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label className="font-bold text-stone-700">كلمة المرور</Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-12 rounded-xl border-2 border-stone-200 focus:border-[#F5820D]"
                  placeholder="••••••••"
                  required
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl font-black text-lg gap-2 bg-gradient-to-r from-[#F5820D] to-[#FF8F00] hover:from-[#C45600] hover:to-[#F5820D] text-white shadow-lg"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
                {loading ? 'جاري الدخول...' : 'دخول'}
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-stone-50 rounded-2xl border border-stone-100">
              <p className="text-xs text-stone-500 font-bold text-center mb-2">بيانات تجريبية</p>
              <div className="flex justify-center gap-4 text-xs text-stone-600">
                <span className="font-mono bg-white px-2 py-1 rounded border">admin@nova-erp.com</span>
                <span className="font-mono bg-white px-2 py-1 rounded border">admin123</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-stone-400 mt-6">
          Nova ERP v1.0 — Prisma + NextAuth + z-ai-web-dev-sdk
        </p>
      </div>
    </div>
  )
}
