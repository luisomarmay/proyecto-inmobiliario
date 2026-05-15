'use client';

// ============================================================
// app/login/page.tsx
// Página de login/registro con tabs.
// Maneja el estado del formulario y llama a lib/auth.ts.
// ============================================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, register, tokenStore } from '../../lib/auth';

// ---- Tipos locales ----
type Tab = 'login' | 'register';

interface FormState {
  name: string;
  email: string;
  password: string;
}

// ---- Componente principal ----
export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('login');
  const [form, setForm] = useState<FormState>({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Actualiza un campo del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null); // limpia el error al escribir
  };

  // Cambia entre login y registro
  const handleTabChange = (newTab: Tab) => {
    setTab(newTab);
    setError(null);
    setForm({ name: '', email: '', password: '' });
  };

  // Envía el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let response;

      if (tab === 'login') {
        response = await login({ email: form.email, password: form.password });
      } else {
        response = await register({ name: form.name, email: form.email, password: form.password });
      }

      // Guarda el token en memoria
      tokenStore.set(response.accessToken);

      // Redirige según el rol del usuario
      if (response.user.role === 'admin') {
        router.push('/dashboard/admin');
      } else {
        router.push('/dashboard');
      }

    } catch (err: any) {
      setError(err.message || 'Ocurrió un error. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--prussian)' }}>

      {/* Card principal */}
      <div className="animate-fade-up w-full max-w-4xl flex rounded-2xl overflow-hidden shadow-2xl">

        {/* Panel izquierdo — branding */}
        <div className="hidden md:flex flex-col justify-center w-5/12 p-12 relative"
          style={{ background: 'var(--prussian)', borderRight: '1px solid rgba(248,249,250,0.07)' }}>

          {/* Logo */}
          <div className="flex items-center gap-2 mb-12">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--orange)' }} />
            <span className="text-sm font-medium tracking-wide"
              style={{ color: 'var(--snow)', fontFamily: 'var(--font-playfair)' }}>
              Sistema Inmobiliario
            </span>
          </div>

          {/* Headline */}
          <div className="mb-6">
            <div className="w-8 h-0.5 mb-5" style={{ background: 'var(--orange)' }} />
            <h1 style={{ fontFamily: 'var(--font-playfair)', color: 'var(--snow)', fontSize: '34px', lineHeight: 1.2, fontWeight: 700 }}>
              Tu próxima<br />propiedad<br />te <span style={{ color: 'var(--orange)' }}>espera</span>
            </h1>
          </div>

          <p className="text-sm leading-relaxed" style={{ color: 'rgba(248,249,250,0.45)', fontWeight: 300 }}>
            Gestiona ventas, rentas y clientes<br />desde un solo lugar.
          </p>

          {/* Decoración */}
          <div className="absolute bottom-10 left-12 flex gap-1.5">
            {[1,2,3].map(i => (
              <div key={i} className="w-1.5 h-1.5 rounded-full"
                style={{ background: i === 1 ? 'var(--orange)' : 'rgba(248,249,250,0.2)' }} />
            ))}
          </div>
        </div>

        {/* Panel derecho — formulario */}
        <div className="flex-1 p-8 md:p-12" style={{ background: 'var(--snow)' }}>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-lg mb-8"
            style={{ background: 'rgba(20,33,61,0.07)' }}>
            {(['login', 'register'] as Tab[]).map(t => (
              <button key={t} onClick={() => handleTabChange(t)}
                className="flex-1 py-2.5 rounded-md text-sm font-medium transition-all duration-200"
                style={{
                  background: tab === t ? 'var(--prussian)' : 'transparent',
                  color: tab === t ? 'var(--snow)' : 'var(--jet)',
                  fontFamily: 'var(--font-dm)',
                }}>
                {t === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
              </button>
            ))}
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} key={tab}>

            <p className="text-xs mb-6" style={{ color: '#6b7280', fontWeight: 300 }}>
              {tab === 'login' ? 'Bienvenido de vuelta' : 'Crea tu cuenta gratis'}
            </p>

            {/* Campo nombre — solo en registro */}
            {tab === 'register' && (
              <div className="mb-4 field-animate">
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide"
                  style={{ color: 'var(--jet)' }}>
                  Nombre completo
                </label>
                <input name="name" type="text" required
                  value={form.name} onChange={handleChange}
                  placeholder="Carlos López"
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                  style={{
                    border: '1.5px solid #e5e7eb',
                    fontFamily: 'var(--font-dm)',
                    color: 'var(--jet)',
                    background: '#fff',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--prussian)'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                />
              </div>
            )}

            {/* Campo email */}
            <div className="mb-4 field-animate">
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide"
                style={{ color: 'var(--jet)' }}>
                Correo electrónico
              </label>
              <input name="email" type="email" required
                value={form.email} onChange={handleChange}
                placeholder="correo@ejemplo.com"
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                style={{
                  border: '1.5px solid #e5e7eb',
                  fontFamily: 'var(--font-dm)',
                  color: 'var(--jet)',
                  background: '#fff',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--prussian)'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>

            {/* Campo contraseña */}
            <div className="mb-5 field-animate">
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide"
                style={{ color: 'var(--jet)' }}>
                Contraseña
              </label>
              <input name="password" type="password" required minLength={6}
                value={form.password} onChange={handleChange}
                placeholder={tab === 'register' ? 'Mínimo 6 caracteres' : '••••••••'}
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                style={{
                  border: '1.5px solid #e5e7eb',
                  fontFamily: 'var(--font-dm)',
                  color: 'var(--jet)',
                  background: '#fff',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--prussian)'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            {/* Olvide mi contraseña */}
           <div className="text-right mb-5">
              <a href="/forgot-password" className="text-xs"
                style={{ color: 'var(--prussian)', fontFamily: 'var(--font-dm)' }}>
              ¿Olvidaste tu contraseña?
             </a>
            </div>
            {/* Mensaje de error */}
            {error && (
              <div className="mb-4 px-4 py-3 rounded-lg text-sm"
                style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                {error}
              </div>
            )}

            {/* Botón principal */}
            <button type="submit" disabled={loading}
              className="field-animate w-full py-3 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                background: loading ? '#6b7280' : 'var(--prussian)',
                color: 'var(--snow)',
                fontFamily: 'var(--font-dm)',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              onMouseEnter={e => { if (!loading) (e.target as HTMLElement).style.background = 'var(--orange)'; (e.target as HTMLElement).style.color = 'var(--prussian)'; }}
              onMouseLeave={e => { if (!loading) (e.target as HTMLElement).style.background = 'var(--prussian)'; (e.target as HTMLElement).style.color = 'var(--snow)'; }}
            >
              {loading ? 'Cargando...' : (tab === 'login' ? 'Ingresar' : 'Crear cuenta')}
            </button>

            {/* Divisor */}
            <div className="flex items-center gap-3 my-5">
              <div className="flex-1 h-px" style={{ background: '#e5e7eb' }} />
              <span className="text-xs" style={{ color: '#9ca3af' }}>o continúa con</span>
              <div className="flex-1 h-px" style={{ background: '#e5e7eb' }} />
            </div>

            {/* Botón Google — funcional en Fase 2 */}
            <button type="button"
              onClick={() => window.location.href = 'http://localhost:3001/auth/google'}
              className="w-full py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-all"
              style={{
                background: '#fff',
                border: '1.5px solid #e5e7eb',
                fontFamily: 'var(--font-dm)',
                color: 'var(--jet)',
                cursor: 'pointer',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#9ca3af')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
            >
              {/* Google icon SVG */}
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </button>

          </form>
        </div>
      </div>
    </main>
  );
}
