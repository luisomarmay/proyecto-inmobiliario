'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token');
  const email = params.get('email'); // viene en la URL desde el correo

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);   // muestra botón reenviar
  const [resent, setResent] = useState(false);      // confirma que se reenivó

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirm) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('http://localhost:3001/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Error al restablecer');
      setDone(true);
    } catch (err: any) {
      // Si el token expiró o es inválido, muestra el botón de reenviar
      if (
        err.message.includes('expirado') ||
        err.message.includes('inválido') ||
        err.message.includes('invalido')
      ) {
        setExpired(true);
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Reenvía un nuevo correo de recuperación
  const handleResend = async () => {
    if (!email) {
      setError('No se encontró el correo. Ve a ¿Olvidaste tu contraseña? e inténtalo de nuevo.');
      return;
    }

    try {
      await fetch('http://localhost:3001/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setResent(true);
      setError(null);
    } catch {
      setError('Error al reenviar el correo. Intenta de nuevo.');
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

          {!done ? (
            <>
              <div className="w-8 h-0.5 mb-5" style={{ background: 'var(--orange)' }} />
              <h1 className="mb-2" style={{ fontFamily: 'var(--font-playfair)', fontSize: '24px', fontWeight: 700, color: 'var(--prussian)' }}>
                Nueva contraseña
              </h1>
              <p className="text-sm mb-8" style={{ color: '#6b7280', fontWeight: 300 }}>
                Elige una contraseña segura para tu cuenta.
              </p>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide"
                    style={{ color: 'var(--jet)' }}>
                    Nueva contraseña
                  </label>
                  <input type="password" required value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                    style={{ border: '1.5px solid #e5e7eb', fontFamily: 'var(--font-dm)', color: 'var(--jet)' }}
                    onFocus={e => e.target.style.borderColor = 'var(--prussian)'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>

                <div className="mb-5">
                  <label className="block text-xs font-medium mb-1.5 uppercase tracking-wide"
                    style={{ color: 'var(--jet)' }}>
                    Confirmar contraseña
                  </label>
                  <input type="password" required value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="Repite la contraseña"
                    className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                    style={{ border: '1.5px solid #e5e7eb', fontFamily: 'var(--font-dm)', color: 'var(--jet)' }}
                    onFocus={e => e.target.style.borderColor = 'var(--prussian)'}
                    onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>

                {/* Mensaje de error */}
                {error && (
                  <div className="mb-4 px-4 py-3 rounded-lg text-sm"
                    style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca' }}>
                    {error}
                  </div>
                )}

                {/* Botón reenviar — aparece solo cuando el token expiró */}
                {expired && !resent && (
                  <button type="button" onClick={handleResend}
                    className="w-full py-3 rounded-lg text-sm font-medium mb-3 transition-all"
                    style={{
                      background: 'var(--orange)',
                      color: 'var(--prussian)',
                      fontFamily: 'var(--font-dm)',
                      cursor: 'pointer',
                      border: 'none',
                      fontWeight: 600,
                    }}>
                    Reenviar correo de recuperación
                  </button>
                )}

                {/* Confirmación de reenvío */}
                {resent && (
                  <div className="mb-4 px-4 py-3 rounded-lg text-sm text-center"
                    style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>
                    ✓ Correo reenviado — revisa tu bandeja de entrada
                  </div>
                )}

                <button type="submit" disabled={loading}
                  className="w-full py-3 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: loading ? '#6b7280' : 'var(--prussian)',
                    color: 'var(--snow)',
                    fontFamily: 'var(--font-dm)',
                    cursor: loading ? 'not-allowed' : 'pointer',
                  }}>
                  {loading ? 'Guardando...' : 'Guardar contraseña'}
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(252,163,17,0.15)' }}>
                <span style={{ fontSize: '24px' }}>✅</span>
              </div>
              <h2 className="mb-3" style={{ fontFamily: 'var(--font-playfair)', fontSize: '20px', fontWeight: 700, color: 'var(--prussian)' }}>
                ¡Contraseña actualizada!
              </h2>
              <p className="text-sm mb-6" style={{ color: '#6b7280', fontWeight: 300 }}>
                Tu contraseña fue restablecida correctamente. Ya puedes iniciar sesión.
              </p>
              <button onClick={() => router.push('/login')}
                className="px-6 py-2.5 rounded-lg text-sm font-medium"
                style={{ background: 'var(--prussian)', color: 'var(--snow)', fontFamily: 'var(--font-dm)' }}>
                Ir al login
              </button>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}