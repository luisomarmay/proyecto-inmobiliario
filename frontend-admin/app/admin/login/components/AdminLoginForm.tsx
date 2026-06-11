'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!email || !password) {
      setError('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/admin/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include', // necesario para que llegue la cookie refreshToken
          body: JSON.stringify({ email, password }),
        },
      )

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Credenciales incorrectas')
        return
      }

      // Guardar el accessToken para las peticiones del panel
      localStorage.setItem('admin_access_token', data.accessToken)

      // Redirigir al dashboard admin
      router.push('/admin/dashboard')
    } catch {
      setError('Error de conexión con el servidor')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400;1,600;1,700&family=Inter:wght@300;400;500;600&display=swap');

        .al-root {
          min-height: 100vh;
          display: flex;
          font-family: 'Inter', sans-serif;
        }

        /* ── PANEL IZQUIERDO ── */
        .al-left {
          width: 45%;
          background: #14213D;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px 44px;
          position: relative;
          overflow: hidden;
        }

        .al-left-line-h {
          position: absolute;
          left: 0; right: 0;
          height: 0.5px;
          background: rgba(252, 163, 17, 0.18);
        }
        .al-left-line-h.top    { top: 104px; }
        .al-left-line-h.bottom { bottom: 88px; }

        .al-left-line-v {
          position: absolute;
          top: 0; bottom: 0;
          width: 0.5px;
          background: rgba(252, 163, 17, 0.1);
        }
        .al-left-line-v.left  { left: 44px; }
        .al-left-line-v.right { right: 44px; }

        .al-brand-area { position: relative; z-index: 1; }

        .al-eyebrow {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(252, 163, 17, 0.7);
          margin: 0 0 8px;
        }

        .al-brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 15px;
          font-weight: 400;
          font-style: italic;
          color: rgba(248, 249, 250, 0.45);
          margin: 0;
        }

        .al-hero { position: relative; z-index: 1; }

        .al-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(32px, 3vw, 44px);
          font-weight: 700;
          line-height: 1.15;
          color: #F8F9FA;
          margin: 0 0 6px;
          letter-spacing: -0.01em;
        }

        .al-headline em {
          font-style: italic;
          color: #FCA311;
        }

        .al-rule {
          width: 36px;
          height: 2px;
          background: #FCA311;
          border-radius: 1px;
          margin: 20px 0;
        }

        .al-desc {
          font-size: 13px;
          font-weight: 300;
          line-height: 1.75;
          color: rgba(248, 249, 250, 0.38);
          margin: 0;
          max-width: 220px;
        }

        .al-dots {
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
          z-index: 1;
        }

        .al-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(248, 249, 250, 0.15);
        }

        .al-dot.active {
          background: #FCA311;
          width: 18px;
          border-radius: 3px;
        }

        /* ── PANEL DERECHO ── */
        .al-right {
          flex: 1;
          background: #F8F9FA;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 56px 52px;
        }

        .al-badge {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #fff;
          border: 0.5px solid #E5E7EB;
          border-radius: 6px;
          padding: 6px 13px;
          margin-bottom: 28px;
          width: fit-content;
        }

        .al-badge-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #FCA311;
          flex-shrink: 0;
        }

        .al-badge-txt {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #6B7280;
        }

        .al-form-title {
          font-family: 'Playfair Display', serif;
          font-size: 30px;
          font-weight: 700;
          color: #14213D;
          margin: 0 0 6px;
          letter-spacing: -0.01em;
        }

        .al-form-sub {
          font-size: 13px;
          color: #9CA3AF;
          margin: 0 0 32px;
        }

        .al-field { margin-bottom: 20px; }

        .al-label {
          display: block;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #374151;
          margin-bottom: 8px;
        }

        .al-input-wrap { position: relative; }

        .al-input {
          width: 100%;
          box-sizing: border-box;
          background: #fff;
          border: 0.5px solid #D1D5DB;
          border-radius: 8px;
          padding: 13px 16px 13px 44px;
          font-family: 'Inter', sans-serif;
          font-size: 14px;
          color: #1F2937;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .al-input::placeholder { color: #CBD5E1; }

        .al-input:focus {
          border-color: #14213D;
          box-shadow: 0 0 0 3px rgba(20, 33, 61, 0.08);
        }

        .al-input.error {
          border-color: #EF4444;
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.08);
        }

        .al-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          color: #D1D5DB;
          pointer-events: none;
          transition: color 0.2s;
        }

        .al-input-wrap:focus-within .al-input-icon { color: #14213D; }

        .al-eye-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 16px;
          color: #D1D5DB;
          cursor: pointer;
          background: none;
          border: none;
          padding: 0;
          line-height: 1;
          transition: color 0.2s;
        }

        .al-eye-btn:hover { color: #14213D; }

        .al-forgot-row {
          display: flex;
          justify-content: flex-end;
          margin-top: -10px;
          margin-bottom: 24px;
        }

        .al-forgot {
          font-size: 12px;
          color: #9CA3AF;
          text-decoration: none;
          transition: color 0.2s;
          cursor: pointer;
        }

        .al-forgot:hover { color: #FCA311; }

        .al-error {
          background: #FEF2F2;
          border: 0.5px solid #FECACA;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          color: #B91C1C;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .al-error i { font-size: 15px; flex-shrink: 0; }

        .al-btn {
          width: 100%;
          background: #14213D;
          border: none;
          border-radius: 8px;
          padding: 14px;
          font-family: 'Playfair Display', serif;
          font-size: 15px;
          font-weight: 600;
          font-style: italic;
          color: #F8F9FA;
          cursor: pointer;
          letter-spacing: 0.01em;
          transition: background 0.2s, transform 0.1s, opacity 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          margin-bottom: 16px;
        }

        .al-btn:hover:not(:disabled) { background: #1a2d52; }
        .al-btn:active:not(:disabled) { transform: scale(0.99); }
        .al-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .al-btn i { font-size: 16px; }

        .al-accent-line {
          height: 1.5px;
          background: #FCA311;
          border-radius: 1px;
          opacity: 0.3;
          margin-bottom: 16px;
        }

        .al-secure {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 20px;
        }

        .al-secure i { font-size: 14px; color: #D1D5DB; }

        .al-secure span {
          font-size: 11px;
          color: #C4C9D4;
          font-style: italic;
        }

        .al-back {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
          color: #9CA3AF;
          text-decoration: none;
          transition: color 0.2s;
        }

        .al-back:hover { color: #14213D; }
        .al-back i { font-size: 14px; }

        /* Spinner */
        @keyframes spin { to { transform: rotate(360deg); } }
        .al-spinner {
          width: 16px;
          height: 16px;
          border: 2px solid rgba(248,249,250,0.3);
          border-top-color: #F8F9FA;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @media (max-width: 768px) {
          .al-left { display: none; }
          .al-right { padding: 40px 28px; }
        }
      `}</style>

      <div className="al-root">
        {/* ── IZQUIERDA ── */}
        <div className="al-left">
          <div className="al-left-line-h top" />
          <div className="al-left-line-h bottom" />
          <div className="al-left-line-v left" />
          <div className="al-left-line-v right" />

          <div className="al-brand-area">
            <p className="al-eyebrow">Sistema inmobiliario</p>
            <p className="al-brand-name">Panel de gestión</p>
          </div>

          <div className="al-hero">
            <h1 className="al-headline">
              Acceso<br />
              <em>exclusivo</em><br />
              admin
            </h1>
            <div className="al-rule" />
            <p className="al-desc">
              Área restringida para administradores autorizados del sistema.
            </p>
          </div>

          <div className="al-dots">
            <span className="al-dot" />
            <span className="al-dot active" />
            <span className="al-dot" />
          </div>
        </div>

        {/* ── DERECHA ── */}
        <div className="al-right">
          <div className="al-badge">
            <span className="al-badge-dot" />
            <span className="al-badge-txt">Acceso administrativo</span>
          </div>

          <h2 className="al-form-title">Iniciar sesión</h2>
          <p className="al-form-sub">Solo personal autorizado</p>

          {/* Campo email */}
          <div className="al-field">
            <label className="al-label" htmlFor="admin-email">
              Correo electrónico
            </label>
            <div className="al-input-wrap">
              <input
                id="admin-email"
                className={`al-input${error ? ' error' : ''}`}
                type="email"
                placeholder="admin@empresa.com"
                autoComplete="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                onKeyDown={handleKeyDown}
              />
              <i className="ti ti-mail al-input-icon" aria-hidden="true" />
            </div>
          </div>

          {/* Campo contraseña */}
          <div className="al-field">
            <label className="al-label" htmlFor="admin-password">
              Contraseña
            </label>
            <div className="al-input-wrap">
              <input
                id="admin-password"
                className={`al-input${error ? ' error' : ''}`}
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••••"
                autoComplete="current-password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError('') }}
                onKeyDown={handleKeyDown}
              />
              <i className="ti ti-lock al-input-icon" aria-hidden="true" />
              <button
                type="button"
                className="al-eye-btn"
                onClick={() => setShowPass(!showPass)}
                aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                <i className={`ti ${showPass ? 'ti-eye-off' : 'ti-eye'}`} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* Olvidé contraseña */}
          <div className="al-forgot-row">
            <Link href="/admin/forgot-password" className="al-forgot">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {/* Error */}
          {error && (
            <div className="al-error" role="alert">
              <i className="ti ti-alert-circle" aria-hidden="true" />
              {error}
            </div>
          )}

          {/* Botón */}
          <button
            className="al-btn"
            type="button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <span className="al-spinner" />
            ) : (
              <>
                <i className="ti ti-login" aria-hidden="true" />
                Ingresar al panel
              </>
            )}
          </button>

          <div className="al-accent-line" />

          <div className="al-secure">
            <i className="ti ti-shield-check" aria-hidden="true" />
            <span>Conexión segura · Sesiones auditadas y monitoreadas</span>
          </div>

          <Link href="/" className="al-back">
            <i className="ti ti-arrow-left" aria-hidden="true" />
            Volver al sitio
          </Link>
        </div>
      </div>
    </>
  )
}
