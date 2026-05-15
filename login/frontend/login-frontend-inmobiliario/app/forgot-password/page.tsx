'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('http://localhost:3001/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error('Error al enviar el correo');
      setSent(true);
    } catch (err: any) {
      setError('Ocurrió un error. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-4"
      style={{ background: 'var(--prussian)' }}>
      <div className="animate-fade-up w-full max-w-md rounded-2xl overflow-hidden shadow-2xl"
        style={{ background: 'var(--snow)' }}>
        <div className="p-10">

          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--orange)' }} />
            <span className="text-sm font-medium" style={{ color: 'var(--prussian)', fontFamily: 'var(--font-playfair)' }}>
              Sistema Inmobiliario
            </span>
          </div>

          {!sent ? (
            <>
              <div className="w-8 h-0.5 mb-5" style={{ background: 'var(--orange)' }} />
              <h1 className="mb-2" style={{ fontFamily: 'var(--font-playfair)', fontSize: '24px', fontWeight: 700, color: 'var(--prussian)' }}>
                ¿Olvidaste tu contraseña?
              </h1>
              <p className="text-sm mb-8" style={{ color: '#6b7280', fontWeight: 300 }}>
                Ingresa tu correo y te enviaremos un enlace para recuperarla.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-5">
                  <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide"
                    style={{ color: 'var(--jet)' }}>
                    Correo electrónico
                  </label>
                  <input type="email" required value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                    style={{ border: '1.5px solid #e5e7eb', fontFamily: 'var(--font-dm)', color: 'var(--jet)' }}
                    onFocus={e => e.target.style.borderColor = 'var(--prussian)'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                {error && (
                  <div className="mb-4 px-4 py-3 rounded-lg text-sm"
                    style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-lg text-sm font-medium transition-all"
                  style={{ background: loading ? '#6b7280' : 'var(--prussian)', color: 'var(--snow)', fontFamily: 'var(--font-dm)', cursor: loading ? 'not-allowed' : 'pointer' }}>
                  {loading ? 'Enviando...' : 'Enviar enlace'}
                </button>
              </form>
            </>
          ) : (
            // Pantalla de confirmación
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(252,163,17,0.15)' }}>
                <span style={{ fontSize: '24px' }}>✉️</span>
              </div>
              <h2 className="mb-3" style={{ fontFamily: 'var(--font-playfair)', fontSize: '20px', fontWeight: 700, color: 'var(--prussian)' }}>
                Revisa tu correo
              </h2>
              <p className="text-sm mb-6" style={{ color: '#6b7280', fontWeight: 300, lineHeight: 1.7 }}>
                Si el correo está registrado recibirás un enlace para restablecer tu contraseña. Revisa también tu carpeta de spam.
              </p>
              <button onClick={() => router.push('/login')}
                className="px-6 py-2.5 rounded-lg text-sm font-medium"
                style={{ background: 'var(--prussian)', color: 'var(--snow)', fontFamily: 'var(--font-dm)' }}>
                Volver al login
              </button>
            </div>
          )}

          {!sent && (
            <button onClick={() => router.push('/login')}
              className="mt-5 text-sm w-full text-center"
              style={{ color: '#6b7280', fontFamily: 'var(--font-dm)' }}>
              ← Volver al login
            </button>
          )}
        </div>
      </div>
    </main>
  );
}