'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
}

// Tarjetas placeholder — reemplaza los datos cuando conectes el backend
const PLACEHOLDER_CARDS = [
  {
    id: 1,
    label: 'Inmuebles publicados',
    value: '—',
    icon: 'ti-building-estate',
    color: '#14213D',
    desc: 'Total en el sistema',
  },
  {
    id: 2,
    label: 'Usuarios registrados',
    value: '—',
    icon: 'ti-users',
    color: '#FCA311',
    desc: 'Clientes activos',
  },
  {
    id: 3,
    label: 'Solicitudes pendientes',
    value: '—',
    icon: 'ti-clock',
    color: '#14213D',
    desc: 'Por revisar',
  },
  {
    id: 4,
    label: 'Contratos activos',
    value: '—',
    icon: 'ti-file-text',
    color: '#FCA311',
    desc: 'En curso',
  },
]

export default function AdminDashboard() {
  const router = useRouter()
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar que hay token admin guardado
    const token = localStorage.getItem('admin_access_token')
    if (!token) {
      router.replace('/admin/login')
      return
    }

    // Obtener datos del admin desde el backend
    async function fetchMe() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        })

        if (!res.ok) {
          // Token inválido o expirado → redirigir al login
          localStorage.removeItem('admin_access_token')
          router.replace('/admin/login')
          return
        }

        const data = await res.json()
        setAdmin(data)
      } catch {
        router.replace('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    fetchMe()
  }, [router])

  function handleLogout() {
    localStorage.removeItem('admin_access_token')
    router.replace('/admin/login')
  }

  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Inter:wght@300;400;500;600&display=swap');
          .db-loading {
            min-height: 100vh;
            background: #F8F9FA;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'Inter', sans-serif;
            color: #9CA3AF;
            font-size: 14px;
            gap: 10px;
          }
          @keyframes spin { to { transform: rotate(360deg); } }
          .db-spinner {
            width: 18px; height: 18px;
            border: 2px solid #E5E7EB;
            border-top-color: #14213D;
            border-radius: 50%;
            animation: spin 0.7s linear infinite;
          }
        `}</style>
        <div className="db-loading">
          <span className="db-spinner" />
          Verificando acceso...
        </div>
      </>
    )
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;0,700;1,600&family=Inter:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .db-root {
          min-height: 100vh;
          background: #F8F9FA;
          font-family: 'Inter', sans-serif;
        }

        /* ── NAVBAR ── */
        .db-nav {
          background: #14213D;
          padding: 0 40px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .db-nav-left {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .db-nav-logo {
          width: 32px; height: 32px;
          background: #FCA311;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .db-nav-logo i { font-size: 17px; color: #14213D; }

        .db-nav-title {
          font-family: 'Playfair Display', serif;
          font-size: 16px;
          font-weight: 700;
          font-style: italic;
          color: #F8F9FA;
        }

        .db-nav-sep {
          width: 1px; height: 20px;
          background: rgba(248,249,250,0.15);
          margin: 0 4px;
        }

        .db-nav-sub {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: rgba(248,249,250,0.35);
        }

        .db-nav-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .db-nav-user {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .db-avatar {
          width: 32px; height: 32px;
          border-radius: 50%;
          background: rgba(252,163,17,0.2);
          border: 1.5px solid rgba(252,163,17,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 600;
          color: #FCA311;
        }

        .db-nav-name {
          font-size: 13px;
          color: rgba(248,249,250,0.7);
        }

        .db-logout-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(248,249,250,0.07);
          border: 0.5px solid rgba(248,249,250,0.12);
          border-radius: 7px;
          padding: 7px 13px;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          font-weight: 500;
          color: rgba(248,249,250,0.6);
          cursor: pointer;
          transition: all 0.2s;
        }

        .db-logout-btn:hover {
          background: rgba(239,68,68,0.15);
          border-color: rgba(239,68,68,0.3);
          color: #FCA5A5;
        }

        .db-logout-btn i { font-size: 14px; }

        /* ── CONTENIDO ── */
        .db-content { padding: 40px; }

        .db-header { margin-bottom: 36px; }

        .db-greeting {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: #FCA311;
          margin-bottom: 6px;
        }

        .db-page-title {
          font-family: 'Playfair Display', serif;
          font-size: 28px;
          font-weight: 700;
          color: #14213D;
          margin-bottom: 4px;
        }

        .db-page-sub {
          font-size: 13px;
          color: #9CA3AF;
          font-weight: 300;
        }

        /* ── GRID TARJETAS ── */
        .db-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-bottom: 36px;
        }

        .db-card {
          background: #fff;
          border-radius: 12px;
          padding: 24px;
          border: 0.5px solid #E5E7EB;
          position: relative;
          overflow: hidden;
          transition: box-shadow 0.2s, transform 0.2s;
        }

        .db-card:hover {
          box-shadow: 0 4px 20px rgba(20,33,61,0.08);
          transform: translateY(-1px);
        }

        .db-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 16px;
        }

        .db-card-icon {
          width: 40px; height: 40px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .db-card-icon i { font-size: 20px; color: #fff; }

        .db-card-badge {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #D1D5DB;
          background: #F9FAFB;
          border: 0.5px solid #E5E7EB;
          border-radius: 4px;
          padding: 3px 7px;
        }

        .db-card-value {
          font-family: 'Playfair Display', serif;
          font-size: 32px;
          font-weight: 700;
          color: #14213D;
          margin-bottom: 4px;
          letter-spacing: -0.02em;
        }

        .db-card-label {
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 2px;
        }

        .db-card-desc {
          font-size: 11px;
          color: #9CA3AF;
        }

        .db-card-line {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 2px;
          opacity: 0.3;
        }

        /* ── SECCIÓN PLACEHOLDER ── */
        .db-section-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px;
          font-weight: 600;
          font-style: italic;
          color: #14213D;
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .db-section-title::after {
          content: '';
          flex: 1;
          height: 0.5px;
          background: #E5E7EB;
        }

        .db-placeholder-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 20px;
        }

        .db-placeholder-box {
          background: #fff;
          border: 0.5px solid #E5E7EB;
          border-radius: 12px;
          padding: 32px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          min-height: 220px;
        }

        .db-placeholder-box i {
          font-size: 32px;
          color: #E5E7EB;
        }

        .db-placeholder-box p {
          font-size: 13px;
          color: #D1D5DB;
          font-style: italic;
          text-align: center;
        }

        .db-coming-badge {
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #FCA311;
          background: rgba(252,163,17,0.08);
          border: 0.5px solid rgba(252,163,17,0.2);
          border-radius: 4px;
          padding: 3px 8px;
        }

        @media (max-width: 1024px) {
          .db-grid { grid-template-columns: repeat(2, 1fr); }
          .db-placeholder-grid { grid-template-columns: 1fr; }
          .db-content { padding: 24px; }
          .db-nav { padding: 0 24px; }
        }
      `}</style>

      <div className="db-root">
        {/* NAVBAR */}
        <nav className="db-nav">
          <div className="db-nav-left">
            <div className="db-nav-logo">
              <i className="ti ti-building-estate" aria-hidden="true" />
            </div>
            <span className="db-nav-title">InmoAdmin</span>
            <span className="db-nav-sep" />
            <span className="db-nav-sub">Dashboard</span>
          </div>

          <div className="db-nav-right">
            {admin && (
              <div className="db-nav-user">
                <div className="db-avatar">
                  {admin.name.charAt(0).toUpperCase()}
                </div>
                <span className="db-nav-name">{admin.name}</span>
              </div>
            )}
            <button className="db-logout-btn" onClick={handleLogout} type="button">
              <i className="ti ti-logout" aria-hidden="true" />
              Cerrar sesión
            </button>
          </div>
        </nav>

        {/* CONTENIDO */}
        <main className="db-content">
          <div className="db-header">
            <p className="db-greeting">Panel de administración</p>
            <h1 className="db-page-title">
              Bienvenido{admin?.name ? `, ${admin.name.split(' ')[0]}` : ''}
            </h1>
            <p className="db-page-sub">
              Aquí verás el resumen general del sistema cuando conectes los módulos.
            </p>
          </div>

          {/* TARJETAS */}
          <div className="db-grid">
            {PLACEHOLDER_CARDS.map((card) => (
              <div className="db-card" key={card.id}>
                <div className="db-card-top">
                  <div
                    className="db-card-icon"
                    style={{ background: card.color }}
                  >
                    <i className={`ti ${card.icon}`} aria-hidden="true" />
                  </div>
                  <span className="db-card-badge">Pronto</span>
                </div>
                <div className="db-card-value">{card.value}</div>
                <div className="db-card-label">{card.label}</div>
                <div className="db-card-desc">{card.desc}</div>
                <div
                  className="db-card-line"
                  style={{ background: card.color }}
                />
              </div>
            ))}
          </div>

          {/* SECCIONES PLACEHOLDER */}
          <p className="db-section-title">Actividad reciente</p>
          <div className="db-placeholder-grid">
            <div className="db-placeholder-box">
              <i className="ti ti-chart-bar" aria-hidden="true" />
              <p>Gráfica de actividad — próximamente</p>
              <span className="db-coming-badge">Por conectar</span>
            </div>
            <div className="db-placeholder-box">
              <i className="ti ti-bell" aria-hidden="true" />
              <p>Notificaciones y alertas del sistema</p>
              <span className="db-coming-badge">Por conectar</span>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
