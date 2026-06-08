 "use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
export function UserMenu() {
  const { user, logout, isLoggedIn } = useAuth();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  if (!isLoggedIn) {
    return (
      <button onClick={() => router.push("/login")}
        className="btn bg-[
#14213D] text-white">
        Iniciar sesión
      </button>
    );
  }
  return (
    <div className="relative">
      {/* Avatar con inicial */}
      <button onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-[
#14213D] text-white flex items-center justify-center font-bold">
        {user?.email?.[0].toUpperCase()}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b">
            <p className="font-semibold text-sm">{user?.name ?? "Usuario"}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
          {/* Opciones */}
          <ul className="py-2 text-sm text-gray-700">
            <li>
              <button onClick={() => router.push("/mis-contactos")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100">
                Mis contactos
              </button>
            </li>
            <li>
              <button onClick={() => router.push("/favoritos")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100">
                Favoritos
              </button>
            </li>
            <li>
              <button onClick={() => router.push("/historial")}
                className="w-full text-left px-4 py-2 hover:bg-gray-100">
                Historial
              </button>
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