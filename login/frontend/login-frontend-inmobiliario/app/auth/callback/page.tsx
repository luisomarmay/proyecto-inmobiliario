'use client';

// ============================================================
// app/auth/callback/page.tsx
// Google redirige aquí después del login con OAuth.
// Lee el token de la URL y redirige al dashboard.
// ============================================================

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { tokenStore } from '../../../lib/auth';

export default function AuthCallbackPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get('token');
    const role = params.get('role');

    if (!token) {
      router.push('/login');
      return;
    }

    // Guarda el token en memoria
    tokenStore.set(token);

    // Redirige según el rol
    if (role === 'admin') {
      router.push('/dashboard/admin');
    } else {
      router.push('/dashboard');
    }
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--prussian)' }}>
      <div className="text-center">
        <div className="w-3 h-3 rounded-full mx-auto mb-4 animate-pulse"
          style={{ background: 'var(--orange)' }} />
        <p className="text-sm" style={{ color: 'rgba(248,249,250,0.6)', fontFamily: 'var(--font-dm)' }}>
          Iniciando sesión con Google...
        </p>
      </div>
    </main>
  );
}