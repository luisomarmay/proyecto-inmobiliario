import type { Metadata } from 'next'
import AdminLoginForm from './components/AdminLoginForm'

export const metadata: Metadata = {
  title: 'Acceso administrativo · Sistema Inmobiliario',
  description: 'Panel de administración exclusivo',
}

export default function AdminLoginPage() {
  return <AdminLoginForm />
}
