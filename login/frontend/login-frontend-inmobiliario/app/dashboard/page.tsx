'use client';

// ============================================================
// app/dashboard/page.tsx
// Página temporal post-login para clientes.
// Se reemplazará en fases siguientes con el dashboard real.
// ============================================================

import { useRouter } from 'next/navigation';
import { logout, tokenStore } from '../../lib/auth';

export default function DashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    const token = tokenStore.get();
    if (token) await logout(token);
    router.push('/login');
  };

  return (
    <main className="min-h-screen flex items-center justify-center"
      style={{ background: 'var(--snow)' }}>
      <div className="text-center">
        <div className="w-3 h-3 rounded-full mx-auto mb-6" style={{ background: 'var(--orange)' }} />
        <h1 style={{ fontFamily: 'var(--font-playfair)', fontSize: '28px', color: 'var(--prussian)', fontWeight: 700 }}>
          Bienvenido al sistema
        </h1>
        <p className="mt-3 mb-8 text-sm" style={{ color: '#6b7280' }}>
          Gracias por iniciar sesión. Aca iria el home?
        </p>
        <button onClick={handleLogout}
          className="px-6 py-2.5 rounded-lg text-sm font-medium transition-all"
          style={{ background: 'var(--prussian)', color: 'var(--snow)', fontFamily: 'var(--font-dm)' }}>
          Cerrar sesión
        </button>
      </div>
    </main>
  );
}
