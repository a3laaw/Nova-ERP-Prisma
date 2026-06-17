'use client'
import { createContext, useContext, useState, ReactNode } from 'react'
const ctx = createContext<any>(undefined)
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [t, setT] = useState<'light'|'dark'>('light')
  const set = (n: 'light'|'dark') => { setT(n); document.documentElement.setAttribute('data-theme', n) }
  return <ctx.Provider value={{ theme: t, toggleTheme: () => set(t === 'light' ? 'dark' : 'light'), setTheme: set }}>{children}</ctx.Provider>
}
export function useAppTheme() { return useContext(ctx) }
