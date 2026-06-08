"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function AuthCallback() {
  const params = useSearchParams();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      localStorage.setItem("accessToken", token);
      //  Recarga completa para que AuthContext lea el token fresco
      window.location.href = "/Inmuebles";
    } else {
      window.location.href = "/";
    }
  }, []);

  return <p>Iniciando sesión...</p>;
}