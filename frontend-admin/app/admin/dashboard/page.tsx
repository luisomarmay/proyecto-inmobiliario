'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import AdminNavbar from "../components/AdminNavbar"

interface AdminUser {
  id: string
  name: string
  email: string
  role: string
}

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
    const token = localStorage.getItem('admin_access_token')
    if (!token) {
      router.replace('/admin/login')
      return
    }

    async function fetchMe() {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
          credentials: 'include',
        })
        if (!res.ok) {
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
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA] gap-3 text-sm text-gray-400">
        <span className="w-4 h-4 border-2 border-gray-300 border-t-[#14213D] rounded-full animate-spin" />
        Verificando acceso...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA]">

      {/* NAVBAR */}
      <AdminNavbar
        admin={admin}
        onLogout={handleLogout}
        currentModule="Dashboard"
      />

      {/* CONTENIDO */}
      <main className="p-10">

        {/* HEADER */}
        <div className="mb-9">
          <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-[#FCA311] mb-1.5">
            Panel de administración
          </p>
          <h1 className="font-playfair text-[28px] font-bold text-[#14213D] mb-1">
            Bienvenido{admin?.name ? `, ${admin.name.split(' ')[0]}` : ''}
          </h1>
          <p className="text-[13px] text-gray-400 font-light">
            Aquí verás el resumen general del sistema cuando conectes los módulos.
          </p>
        </div>

        {/* TARJETAS */}
        <div className="grid grid-cols-4 gap-5 mb-9">
          {PLACEHOLDER_CARDS.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-xl p-6 border border-gray-100 relative overflow-hidden
                         transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            >
              {/* Top row */}
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-[10px] flex items-center justify-center"
                  style={{ background: card.color }}
                >
                  <i className={`ti ${card.icon} text-white text-xl`} aria-hidden="true" />
                </div>
                <span className="text-[10px] font-semibold tracking-[0.08em] uppercase
                                 text-gray-300 bg-gray-50 border border-gray-200 rounded px-1.5 py-0.5">
                  Pronto
                </span>
              </div>

              {/* Value */}
              <div className="font-playfair text-[32px] font-bold text-[#14213D] mb-1 tracking-tight">
                {card.value}
              </div>

              {/* Label */}
              <div className="text-[13px] font-semibold text-gray-700 mb-0.5">
                {card.label}
              </div>

              {/* Desc */}
              <div className="text-[11px] text-gray-400">
                {card.desc}
              </div>

              {/* Bottom line */}
              <div
                className="absolute bottom-0 left-0 right-0 h-0.5 opacity-30"
                style={{ background: card.color }}
              />
            </div>
          ))}
        </div>

        {/* SECCIÓN ACTIVIDAD RECIENTE */}
        <div className="flex items-center gap-3 mb-4">
          <p className="font-playfair text-[18px] font-semibold italic text-[#14213D] whitespace-nowrap">
            Actividad reciente
          </p>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="grid grid-cols-[2fr_1fr] gap-5">
          {/* Gráfica placeholder */}
          <div className="bg-white border border-gray-100 rounded-xl p-8
                          flex flex-col items-center justify-center gap-2.5 min-h-[220px]">
            <i className="ti ti-chart-bar text-[32px] text-gray-200" aria-hidden="true" />
            <p className="text-[13px] text-gray-300 italic text-center">
              Gráfica de actividad — próximamente
            </p>
            <span className="text-[10px] font-semibold tracking-[0.1em] uppercase
                             text-[#FCA311] bg-[#FCA311]/8 border border-[#FCA311]/20
                             rounded px-2 py-0.5">
              Por conectar
            </span>
          </div>

          {/* Notificaciones placeholder */}
          <div className="bg-white border border-gray-100 rounded-xl p-8
                          flex flex-col items-center justify-center gap-2.5 min-h-[220px]">
            <i className="ti ti-bell text-[32px] text-gray-200" aria-hidden="true" />
            <p className="text-[13px] text-gray-300 italic text-center">
              Notificaciones y alertas del sistema
            </p>
            <span className="text-[10px] font-semibold tracking-[0.1em] uppercase
                             text-[#FCA311] bg-[#FCA311]/8 border border-[#FCA311]/20
                             rounded px-2 py-0.5">
              Por conectar
            </span>
          </div>
        </div>

      </main>
    </div>
  )
}