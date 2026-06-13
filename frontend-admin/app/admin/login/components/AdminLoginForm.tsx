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
      <div className="al-root">
        {/* ── IZQUIERDA ── */}
        <div className="al-left">

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
