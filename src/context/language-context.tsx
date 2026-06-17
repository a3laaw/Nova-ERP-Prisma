'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
const ctx = createContext<any>(undefined)
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<'ar'|'en'>('ar')
  const [dir, setDir] = useState<'rtl'|'ltr'>('rtl')
  const toggle = () => { const n = lang === 'ar' ? 'en' : 'ar'; setLang(n); setDir(n === 'ar' ? 'rtl' : 'ltr') }
  return <ctx.Provider value={{ language: lang, direction: dir, toggleLanguage: toggle, isRTL: lang === 'ar', lang, t: (k: string) => k }}>{children}</ctx.Provider>
}
export function useLanguage() { return useContext(ctx) }
