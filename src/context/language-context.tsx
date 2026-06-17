'use client'
import { createContext, useContext, useState, ReactNode } from 'react'

type Language = 'ar' | 'en'
type Direction = 'rtl' | 'ltr'

interface LanguageContextType {
  language: Language
  direction: Direction
  isRTL: boolean
  lang: Language
  toggleLanguage: () => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ar')
  const direction: Direction = language === 'ar' ? 'rtl' : 'ltr'
  const toggleLanguage = () => setLanguage(prev => prev === 'ar' ? 'en' : 'ar')
  return (
    <LanguageContext.Provider value={{
      language, direction, isRTL: language === 'ar', lang: language,
      toggleLanguage, t: (k: string) => k
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextType {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    // Fallback — return default Arabic
    return {
      language: 'ar', direction: 'rtl', isRTL: true, lang: 'ar',
      toggleLanguage: () => {}, t: (k: string) => k
    }
  }
  return ctx
}
