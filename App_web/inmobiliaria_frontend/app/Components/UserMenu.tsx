"use client";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { motion } from "framer-motion";

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
    <div 
  className="relative"
  onMouseEnter={() => setOpen(true)}
  onMouseLeave={() => setOpen(false)}
  style={{ paddingBottom: "8px" }}>  {/* ← Agrega espacio invisible */}
  
  {/* Avatar */}
  <button className="w-10 h-10 rounded-full bg-[#14213D] text-white flex items-center justify-center font-bold border-2 border-white hover:border-[#FCA311] transition">
    {user?.email?.[0].toUpperCase()}
  </button>

      {/* Dropdown con animación */}
      {open && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 top-12 w-56 bg-white rounded-xl shadow-xl border z-[999]">
          
          {/* Header */}
          <div className="px-4 py-3 border-b">
            <p className="font-semibold text-sm text-black">{user?.name || user?.email}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>

          {/* Opciones */}
          <ul className="py-2 text-sm text-gray-700">
            <li>
              <a href="/mis-contactos" className="w-full text-left px-4 py-2 hover:bg-gray-100 block transition">
                Mis contactos
              </a>
            </li>
            <li>
              <a href="/favoritos" className="w-full text-left px-4 py-2 hover:bg-gray-100 block transition">
                Favoritos
              </a>
            </li>
            <li>
              <a href="/historial" className="w-full text-left px-4 py-2 hover:bg-gray-100 block transition">
                Historial
              </a>
            </li>
          </ul>

          <div className="border-t py-2">
            <button 
              onClick={() => {
                logout();
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100 transition">
              Cerrar sesión
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}