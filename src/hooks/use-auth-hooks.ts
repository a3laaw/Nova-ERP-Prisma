'use client';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

export const useCurrentCompany = () => {
  const { data: session } = useSession();
  const companyId = (session?.user as any)?.companyId || '';
  return { id: companyId, slug: '' };
};

export const usePermission = (required: string | string[]): boolean => {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  return useMemo(() => {
    if (!role) return false;
    const roles = Array.isArray(required) ? required : [required];
    return roles.includes(role) || role === 'admin';
  }, [role, required]);
};

export const useAuthError = () => {
  return { error: null as string | null, clear: () => {} };
};
