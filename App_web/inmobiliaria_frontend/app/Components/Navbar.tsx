"use client";
import { UserMenu } from "@/app/Components/UserMenu";

export default function Navbar() {
  return (
    <div>
      <nav className="color1 left-0 right-0 z-[100] flex justify-between items-center px-12 py-4 bg-oscuro/95 border-b border-white/10 shadow-xl/30">
        
        {/* Agrupa los tres elementos del lado izquierdo */}
        <div className="flex items-center gap-3">
          <p className="text-xl font-bold font-playfair tracking-wide text-white italic">Sistema Inmobiliario</p>
          <span className="text-white/30">|</span>
          <span className="text-base text-white/60 font-inter">PROPIEDADES</span>
        </div>

        <UserMenu />
      </nav>
    </div>
  );
}