'use client'
import { useSession } from 'next-auth/react'
import { createContext, useContext, ReactNode } from 'react'

export interface AuthenticatedUser {
  id: string; email: string; username: string; fullName?: string | null;
  role: string; jobTitle?: string | null; companyId?: string | null;
  currentCompanyId?: string | null; isActive: boolean; name?: string;
}

interface AuthContextType {
  user: AuthenticatedUser | null;
  company: any | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const user = session?.user ? {
    id: (session.user as any).id || 'admin',
    email: session.user.email || '',
    username: (session.user as any).name || 'admin',
    fullName: session.user.name,
    name: session.user.name,
    role: (session.user as any).role || 'admin',
    companyId: (session.user as any).companyId,
    currentCompanyId: (session.user as any).companyId,
    isActive: true,
  } as AuthenticatedUser : null

  return (
    <AuthContext.Provider value={{
      user, company: null, loading: status === 'loading', error: null,
      login: async () => {}, logout: async () => {}, resetPassword: async () => {}, refreshToken: async () => {},
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) return { user: null, company: null, loading: false, error: null, login: async () => {}, logout: async () => {}, resetPassword: async () => {}, refreshToken: async () => {} }
  return ctx
}
