'use client';

import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { useAuth as useFirebaseAuthService } from '@/context/auth-context';

export function useUser() {
  const auth = useFirebaseAuthService();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    // استخدم mock user مباشرة بدون استدعاء onAuthStateChanged
    if (auth?.user) {
      setUser(auth.user as any);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [auth?.user]);

  return { user, loading, error };
}
