"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";

export function UserMenu() {
  const { user, logout, isLoggedIn } = useAuth();
  const [open, setOpen] = useState(false);

  if (!isLoggedIn) {
    return (
      <a href="http://localhost:3004/login"
        className="bg-amber-500 text-white px-4 py-2 rounded-lg font-medium">
        Iniciar sesión
      </a>
    );
  }

  return (
    <div className="relative flex items-center">
      <button
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-[#14213D] text-white flex items-center justify-center font-bold border-2 border-white">
        {user?.email?.[0].toUpperCase()}
      </button>

      {open && (
        <div className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border z-[9999]">
          <div className="px-4 py-3 border-b">
            <p className="font-semibold text-sm text-black">{user?.name ?? "Usuario"}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          <ul className="py-2 text-sm text-gray-700">
            <li>
              <a href="/mis-contactos" className="w-full text-left px-4 py-2 hover:bg-gray-100 block">
                Mis contactos
              </a>
            </li>
            <li>
              <a href="/favoritos" className="w-full text-left px-4 py-2 hover:bg-gray-100 block">
                ♡ Favoritos
              </a>
            </li>
            <li>
              <a href="/historial" className="w-full text-left px-4 py-2 hover:bg-gray-100 block">
                Historial
              </a>
            </li>
          </ul>
          <div className="border-t py-2">
            <button onClick={logout}
              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100">
              Cerrar sesión
            </button>
          </div>
        </div>
      )}
    </div>
  );
}