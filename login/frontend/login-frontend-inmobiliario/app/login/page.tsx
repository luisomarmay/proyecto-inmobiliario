'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login, register, tokenStore } from '../../lib/auth';

type Tab = 'login' | 'register';
interface FormState { name: string; email: string; password: string; }

const slides = [
  {
    title: <>Tu próxima<br />propiedad<br />te <span style={{ color: 'var(--orange)' }}>espera</span></>,
    sub: 'Gestiona ventas, rentas y clientes desde un solo lugar.',
  },
  {
    title: <>Propiedades<br />con tecnología<br /><span style={{ color: 'var(--orange)' }}>de punta</span></>,
    sub: 'Publica con tours 360° y multimedia 4K.',
  },
  {
    title: <>Contratos<br />digitales<br /><span style={{ color: 'var(--orange)' }}>sin papel</span></>,
    sub: 'Firma documentos sin salir de la plataforma.',
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('login');
  const [form, setForm] = useState<FormState>({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % slides.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleTabChange = (newTab: Tab) => {
    setTab(newTab);
    setError(null);
    setForm({ name: '', email: '', password: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = tab === 'login'
        ? await login({ email: form.email, password: form.password })
        : await register({ name: form.name, email: form.email, password: form.password });

      // tokenStore.set(response.accessToken);
      // router.push(response.user.role === 'admin' ? '/dashboard/admin' : 'http://localhost:3000/Inmuebles');
      tokenStore.set(response.accessToken);
      if (response.user.role === 'admin') {
        router.push('/dashboard/admin');
        } else {
        // Redirige al callback del buscador pasando el token en la URL
        window.location.href = `http://localhost:3000/auth/callback?token=${response.accessToken}&role=${response.user.role}`;
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

          {/* Headline — cambia con cada slide */}
          <div className="mb-6">
            <div className="w-8 h-0.5 mb-5" style={{ background: 'var(--orange)' }} />
            <h1 key={activeSlide}
              className="animate-fade-up"
              style={{
                fontFamily: 'var(--font-playfair)',
                color: 'var(--snow)',
                fontSize: '34px',
                lineHeight: 1.2,
                fontWeight: 700,
              }}>
              {slides[activeSlide].title}
            </h1>
          </div>

          {/* Slides automáticos */}
          <div className="absolute bottom-10 left-12 right-8">
            <p className="text-sm mb-4 transition-all duration-500"
              style={{ color: 'rgba(248,249,250,0.7)', fontWeight: 300, minHeight: '44px', lineHeight: 1.6 }}>
              {slides[activeSlide].sub}
            </p>
            <div className="flex gap-1.5">
              {slides.map((_, i) => (
                <button key={i} type="button" onClick={() => setActiveSlide(i)}
                  className="transition-all duration-300"
                  style={{
                    width: activeSlide === i ? '20px' : '6px',
                    height: '6px',
                    borderRadius: '3px',
                    background: activeSlide === i ? 'var(--orange)' : 'rgba(248,249,250,0.3)',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }} />
              ))}
            </div>
          </div>
        </div>

        {/* Panel derecho — formulario */}
        <div className="flex-1 p-8 md:p-12" style={{ background: 'var(--snow)' }}>

          {/* Tabs */}
          <div className="flex gap-1 p-1 rounded-lg mb-8"
            style={{ background: 'rgba(20,33,61,0.07)' }}>
            {(['login', 'register'] as Tab[]).map(t => (
              <button key={t} type="button" onClick={() => handleTabChange(t)}
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

            {tab === 'register' && (
              <div className="mb-4 field-animate">
                <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide"
                  style={{ color: 'var(--jet)' }}>Nombre completo</label>
                <input name="name" type="text" required value={form.name}
                  onChange={handleChange} placeholder="Carlos López"
                  className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                  style={{ border: '1.5px solid #e5e7eb', fontFamily: 'var(--font-dm)', color: 'var(--jet)', background: '#fff' }}
                  onFocus={e => e.target.style.borderColor = 'var(--prussian)'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
            )}

            <div className="mb-4 field-animate">
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide"
                style={{ color: 'var(--jet)' }}>Correo electrónico</label>
              <input name="email" type="email" required value={form.email}
                onChange={handleChange} placeholder="correo@ejemplo.com"
                className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                style={{ border: '1.5px solid #e5e7eb', fontFamily: 'var(--font-dm)', color: 'var(--jet)', background: '#fff' }}
                onFocus={e => e.target.style.borderColor = 'var(--prussian)'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
            </div>

            <div className="mb-2 field-animate">
              <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide"
                style={{ color: 'var(--jet)' }}>Contraseña</label>
              <div className="relative">
                <input name="password" type={showPassword ? 'text' : 'password'} required minLength={6}
                  value={form.password} onChange={handleChange}
                  placeholder={tab === 'register' ? 'Mínimo 6 caracteres' : '••••••••'}
                  className="w-full px-4 py-3 pr-11 rounded-lg text-sm outline-none"
                  style={{ border: '1.5px solid #e5e7eb', fontFamily: 'var(--font-dm)', color: 'var(--jet)', background: '#fff' }}
                  onFocus={e => e.target.style.borderColor = 'var(--prussian)'}
                  onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(prev => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--prussian)')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}>
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 4.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {tab === 'login' && (
              <div className="text-right mb-4">
                <a href="/forgot-password" className="text-xs"
                  style={{ color: 'var(--prussian)', fontFamily: 'var(--font-dm)' }}>
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            )}

            {error && (
              <div className="mb-4 px-4 py-3 rounded-lg text-sm"
                style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-lg text-sm font-medium transition-all duration-200"
              style={{
                background: loading ? '#6b7280' : 'var(--prussian)',
                color: 'var(--snow)',
                fontFamily: 'var(--font-dm)',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}>
              {loading ? 'Cargando...' : (tab === 'login' ? 'Ingresar' : 'Crear cuenta')}
            </button>
          </form>

          {/* Botones sociales — FUERA del form */}
          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px" style={{ background: '#e5e7eb' }} />
            <span className="text-xs" style={{ color: '#9ca3af' }}>o continúa con</span>
            <div className="flex-1 h-px" style={{ background: '#e5e7eb' }} />
          </div>

          <div className="flex flex-col gap-3">
            {/* Google */}
            <button type="button"
              onClick={() => window.location.href = 'https://login-backend-inmobiliario-production.up.railway.app/auth/google'}
              className="w-full py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-all"
              style={{ background: '#fff', border: '1.5px solid #e5e7eb', fontFamily: 'var(--font-dm)', color: 'var(--jet)', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = '#9ca3af')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = '#e5e7eb')}>
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continuar con Google
            </button>

            {/* Facebook */}
            <button type="button"
              onClick={() => window.location.href = 'https://login-backend-inmobiliario-production.up.railway.app/auth/facebook'}
              className="w-full py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-all"
              style={{ background: '#1877F2', border: '1.5px solid #1877F2', fontFamily: 'var(--font-dm)', color: '#fff', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.9')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              Continuar con Facebook
            </button>

            {/* X (Twitter) */}
            <button type="button"
            onClick={() => window.location.href = 'https://login-backend-inmobiliario-production.up.railway.app/auth/twitter'}
              className="w-full py-3 rounded-lg text-sm flex items-center justify-center gap-2 transition-all"
              style={{ background: '#000', border: '1.5px solid #000', fontFamily: 'var(--font-dm)', color: '#fff', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              Continuar con X
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
