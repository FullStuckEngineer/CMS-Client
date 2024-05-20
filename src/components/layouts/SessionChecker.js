'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const SessionChecker = ({ session, children }) => {
  const router = useRouter();

  useEffect(() => {
    console.log("Checking session:", session);
    if (!session) {
      router.push('/auth/login');
    }
  }, [session, router]);

  if (!session) {
    return null;
  }

  return <>{children}</>;
};

export default SessionChecker;