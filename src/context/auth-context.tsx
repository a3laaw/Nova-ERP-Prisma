'use client'
import { createContext, useContext, ReactNode } from 'react'

export interface AuthenticatedUser {
  id: string; email: string; username: string; fullName?: string | null;
  role: string; jobTitle?: string | null; companyId?: string | null;
  currentCompanyId?: string | null; isActive: boolean; name?: string;
}

// Mock user ثابت — يعمل بدون NextAuth تماماً
const MOCK_USER: AuthenticatedUser = {
  id: 'admin',
  email: 'admin@nova-erp.com',
  username: 'admin',
  fullName: 'مدير النظام',
  name: 'مدير النظام',
  role: 'admin',
  jobTitle: 'مدير النظام',
  companyId: 'company-1',
  currentCompanyId: 'company-1',
  isActive: true,
}

interface AuthContextType {
  user: AuthenticatedUser | null; company: any | null; loading: boolean;
  error: string | null; login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>; resetPassword: (email: string) => Promise<void>; refreshToken: () => Promise<void>;
  currentRole?: string;
  refreshUserData?: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={{
      user: MOCK_USER,
      company: { id: 'company-1', name: 'Nova Engineering', legalName: 'Nova Engineering Co.' },
      currentRole: MOCK_USER.role,
      loading: false,
      error: null,
      login: async () => {},
      logout: async () => {},
      resetPassword: async () => {},
      refreshToken: async () => {},
      refreshUserData: async () => {},
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    // Fallback safe في حال لم يكن المكون داخل AuthProvider
    return {
      user: MOCK_USER,
      company: { id: 'company-1', name: 'Nova Engineering' },
      currentRole: 'admin',
      loading: false,
      error: null,
      login: async () => {},
      logout: async () => {},
      resetPassword: async () => {},
      refreshToken: async () => {},
      refreshUserData: async () => {},
    } as AuthContextType
  }
  return ctx
}
