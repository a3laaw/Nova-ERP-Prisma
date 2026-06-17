'use client'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Send, X, Loader2 } from 'lucide-react'

interface Message { role: 'user' | 'assistant'; content: string }

export function SystemExpertChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'مرحباً! أنا المساعد الذكي لنظام Nova ERP. كيف يمكنني مساعدتك؟' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMsg = input.trim()
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai/system-expert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMsg, history: messages }),
      })
      if (!res.ok) throw new Error('فشل الاتصال')
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.answer || 'عذراً، لم أتمكن من الإجابة.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'عذراً، حدث خطأ. حاول مرة أخرى.' }])
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-gradient-to-br from-[#F5820D] to-[#FF8F00] rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
        title="المساعد الذكي"
      >
        <Sparkles className="h-6 w-6 text-white" />
      </button>
    )
  }

  return (
    <Card className="fixed bottom-6 left-6 z-50 w-96 max-w-[calc(100vw-3rem)] rounded-3xl shadow-2xl border-2 border-[#F5820D]/20 overflow-hidden" dir="rtl">
      <CardHeader className="bg-gradient-to-br from-[#F5820D] to-[#FF8F00] p-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-white" />
          <CardTitle className="text-white text-sm font-black">المساعد الذكي</CardTitle>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white"><X className="h-4 w-4" /></button>
      </CardHeader>
      <CardContent className="p-0">
        <div ref={scrollRef} className="h-80 overflow-y-auto p-4 space-y-3 bg-stone-50">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${msg.role === 'user' ? 'bg-[#F5820D] text-white' : 'bg-white border text-stone-800'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && <div className="flex justify-end"><div className="bg-white border rounded-2xl p-3"><Loader2 className="h-4 w-4 animate-spin text-stone-400" /></div></div>}
        </div>
        <div className="p-3 border-t flex gap-2 bg-white">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="اكتب سؤالك..."
            className="flex-1 h-10 rounded-xl border-2 text-sm"
            disabled={loading}
          />
          <Button onClick={handleSend} disabled={loading || !input.trim()} size="icon" className="h-10 w-10 rounded-xl bg-[#F5820D] hover:bg-[#C45600]">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
export default SystemExpertChatWidget
