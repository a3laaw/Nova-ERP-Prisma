'use client'
import { createContext, useContext, ReactNode } from 'react'
const defaultBranding = { id: 'default', company_name: 'Nova ERP', header_color: '#F5820D', work_hours: { holidays: ['Friday', 'Saturday'] } }
const ctx = createContext<{ branding: any; loading: boolean }>({ branding: defaultBranding, loading: false })
export function BrandingProvider({ children }: { children: ReactNode }) { return <ctx.Provider value={{ branding: defaultBranding, loading: false }}>{children}</ctx.Provider> }
export function useBranding() { return useContext(ctx) }
