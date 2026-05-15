// ============================================================
// lib/auth.ts
// Funciones para comunicarse con el backend NestJS.
// Todas las llamadas al API pasan por aquí.
// Si cambia la URL del backend, solo se cambia BACKEND_URL.
// ============================================================

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

// Estructura del usuario que devuelve el backend
export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'cliente_final';
  avatar: string | null;
}

// Respuesta estándar del backend al login/register
export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

// Guarda el token en memoria (más seguro que localStorage)
// En producción considera usar una cookie httpOnly manejada por Next.js
let _accessToken: string | null = null;

export const tokenStore = {
  get: () => _accessToken,
  set: (token: string) => { _accessToken = token; },
  clear: () => { _accessToken = null; },
};

// ----------------------------------------------------------
// REGISTRO
// ----------------------------------------------------------
export async function register(data: {
  name: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${BACKEND_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // envía/recibe cookies (refresh token)
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al registrarse');
  }

  return res.json();
}

// ----------------------------------------------------------
// LOGIN
// ----------------------------------------------------------
export async function login(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Credenciales incorrectas');
  }

  return res.json();
}

// ----------------------------------------------------------
// LOGOUT
// ----------------------------------------------------------
export async function logout(token: string): Promise<void> {
  await fetch(`${BACKEND_URL}/auth/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    credentials: 'include',
  });
  tokenStore.clear();
}
