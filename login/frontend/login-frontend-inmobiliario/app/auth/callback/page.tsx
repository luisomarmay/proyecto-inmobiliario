'use client';

import { Suspense } from 'react';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { tokenStore } from '../../../lib/auth';

function CallbackContent() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get('token');
    const role = params.get('role');

    if (!token) {
      router.push('/login');
      return;
    }

    tokenStore.set(token);

    if (role === 'admin') {
      router.push('/dashboard/admin');
    } else {
      router.push('/dashboard');
    }
  }, []);

  const provider = params.get('provider') || 'google';
  const providerName = provider.charAt(0).toUpperCase() + provider.slice(1);

  return (
    <main className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--prussian)' }}>
      <div className="text-center">
        <div className="w-3 h-3 rounded-full mx-auto mb-4 animate-pulse"
          style={{ background: 'var(--orange)' }} />
        <p className="text-sm" style={{ color: 'rgba(248,249,250,0.6)', fontFamily: 'var(--font-dm)' }}>
          Iniciando sesión con {providerName}...
        </p>
      </div>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense>
      <CallbackContent />
    </Suspense>
  );
}