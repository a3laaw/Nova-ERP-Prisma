'use client'
import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
const ctx = createContext<any>(undefined)
export function CompanyProvider({ children }: { children: ReactNode }) {
  const [c, setC] = useState<any>(null)
  const s = useCallback((comp: any) => setC(comp), [])
  return <ctx.Provider value={{ currentCompany: c, companyFirestore: null, companyAuth: null, isLoadingCompany: false, setCurrentCompany: s }}>{children}</ctx.Provider>
}
export function useCompany() { const c = useContext(ctx); return c || { currentCompany: null, companyFirestore: null, companyAuth: null, isLoadingCompany: false, setCurrentCompany: () => {} } }
