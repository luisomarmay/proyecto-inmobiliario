"use client";
import { UserMenu } from "@/app/Components/UserMenu";

export default function Navbar() {
  return (
    <div>
      <nav className="color1 left-0 right-0 z-[100] flex justify-between items-center px-12 py-4 bg-oscuro/95 border-b border-white/10 shadow-xl/30">
        <p className="text-xl font-inter font-bold font-playfair text-white">Sistema Inmobiliario</p>
        <UserMenu />
      </nav>
    </div>
  );
}