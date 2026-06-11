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

        <div className="db-loading">
          <span className="db-spinner" />
          Verificando acceso...
        </div>
      </>
    )
  }

  return (
    <>
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
