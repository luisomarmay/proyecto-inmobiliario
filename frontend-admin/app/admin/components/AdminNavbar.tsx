"use client";
import Link from "next/link";

interface AdminNavbarProps {
    admin: { name: string } | null;
    onLogout: () => void;
    currentModule?: string;
}

export default function AdminNavbar({ admin, onLogout, currentModule }: AdminNavbarProps) {
    return (
    <nav className="left-0 right-0 z-[100] flex justify-between items-center px-12 h-16
                    bg-[#14213D] border-b border-white/20">

      {/* Izquierda — igual que navbar de propiedades */}
        <div className="flex items-center gap-3">

        <p className="text-xl font-bold font-playfair tracking-wide text-white italic">
            Sistema Inmobiliario
        </p>
        <span className="text-white/30">|</span>
        <span className="text-base text-white/60 font-inter uppercase tracking-widest">
            {currentModule ?? "Dashboard"}
        </span>
        </div>

      {/* Derecha — avatar + cerrar sesión */}
        <div className="flex items-center gap-4">
        {admin && (
            <div className="flex items-center gap-2">
            {/* Avatar — igual al de UserMenu pero con colores del admin */}
            <div className="w-8 h-8 rounded-full bg-[#14213D] text-white flex items-center 
            justify-center font-bold border-2 border-white hover:border-[#FCA311] transition">
                {admin.name.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-white/70 font-inter">{admin.name}</span>
            </div>
        )}

        {/* Botón cerrar sesión — mismo estilo que el hover del logout actual */}
        <button
        onClick={onLogout}
        type="button"
        className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium font-inter
                    text-white/60 bg-white/5 border border-white/10
                    transition-all duration-200
                    hover:bg-red-500/15 hover:border-red-500/30 hover:text-red-300">
        <i className="ti ti-logout text-sm" aria-hidden="true" />
        Cerrar sesión
        </button>
</div>
</nav>
);
}