"use client";
import { Mail, Smartphone, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";

interface ContactFormProps {
    property: any;
    isModal?: boolean;
    onClose?: () => void;
}

    export function ContactForm({ property, isModal = false, onClose }: ContactFormProps) {
        const { user, token, isLoggedIn } = useAuth();
        const [form, setForm] = useState({ nombre: "", email: "", telefono: "", mensaje: "" });
        const [errors, setErrors] = useState({ nombre: "", email: "", telefono: "", mensaje: "" });
        const [sending, setSending] = useState(false);

  useEffect(() => {
    if (isLoggedIn && user) {
      setForm({
        nombre: user.name ?? "",
        email: user.email ?? "",
        telefono: user.phone ?? "",
        mensaje: `¡Hola! Quiero que se comuniquen conmigo por esta propiedad: ${property.title}`,
      });
    }
  }, [isLoggedIn, user, property.title]);

  const handleSubmit = async () => {
    const newErrors = { nombre: "", email: "", telefono: "", mensaje: "" };

    if (!form.nombre.trim()) newErrors.nombre = "El nombre es obligatorio";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Por favor ingresa un email válido";
    }

    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    if (!form.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio";
    } else if (!phoneRegex.test(form.telefono)) {
      newErrors.telefono = "Mínimo 10 dígitos";
    }

    if (!form.mensaje.trim()) newErrors.mensaje = "El mensaje es obligatorio";

    setErrors(newErrors);

    if (Object.values(newErrors).some(err => err)) return;

    setSending(true);
    try {
    await fetch("http://localhost:3001/contacto/easybroker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          property_id: property.id,
          name: form.nombre,
          email: form.email,
          phone: form.telefono,
          message: form.mensaje,
        }),
      });
      alert("¡Solicitud enviada!");
      setForm({ nombre: "", email: "", telefono: "", mensaje: "" });
      if (isModal && onClose) onClose();
    } catch (err) {
      setErrors({ ...errors, mensaje: "Error al enviar" });
    } finally {
      setSending(false);
    }
  };

  const content = (
    <div className="grid grid-cols-5 gap-2 m-3">
      {/* Nombre */}
      <div className="col-span-2">
        <input
          className="text-white border-2 color3 border-slate-600/40 rounded-lg p-2 text-sm focus:outline-2 focus:outline-[#FCA311] w-full"
          type="text"
          placeholder="Nombre"
          value={form.nombre}
          onChange={(e) => {
            setForm({ ...form, nombre: e.target.value });
            setErrors({ ...errors, nombre: "" });
          }}
        />
        {errors.nombre && <p className="text-red-400 text-xs mt-1">{errors.nombre}</p>}
      </div>

      {/* Email */}
      <div className="col-span-3">
        <input
          className="text-white border-2 color3 border-slate-600/40 rounded-lg p-2 text-sm focus:outline-2 focus:outline-[#FCA311] w-full"
          type="email"
          placeholder="E-mail"
          value={form.email}
          onChange={(e) => {
            setForm({ ...form, email: e.target.value });
            setErrors({ ...errors, email: "" });
          }}
        />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
      </div>

      {/* Teléfono */}
      <div className="col-span-5">
        <input
          type="tel"
          className="border-slate-600/40 color3 text-white rounded-lg p-2 text-sm border-2 focus:outline-2 focus:outline-[#FCA311] w-full"
          placeholder="Teléfono"
          value={form.telefono}
          onChange={(e) => {
            setForm({ ...form, telefono: e.target.value });
            setErrors({ ...errors, telefono: "" });
          }}
        />
        {errors.telefono && <p className="text-red-400 text-xs mt-1">{errors.telefono}</p>}
      </div>

      {/* Mensaje */}
      <div className="col-span-5">
        <textarea
          placeholder="Mensaje"
          className="text-white h-[80px] color3 border-slate-600/40 border-2 rounded-lg p-2 text-sm resize-none focus:outline-2 focus:outline-[#FCA311] w-full"
          value={form.mensaje}
          onChange={(e) => {
            setForm({ ...form, mensaje: e.target.value });
            setErrors({ ...errors, mensaje: "" });
          }}
        />
        {errors.mensaje && <p className="text-red-400 text-xs mt-1">{errors.mensaje}</p>}
      </div>

      {/* Botones */}
      <button 
        onClick={handleSubmit}
        disabled={sending}
        className="rounded-lg col-span-5 bg-[#FCA311] text-black p-2 text-sm flex justify-center gap-2 items-center hover:bg-[#e89200] transition disabled:opacity-50">
        <Mail size={15} />
        {sending ? "Enviando..." : "Correo"}
      </button>

      <a 
        href={`tel:${property.agent?.phone || "+525551234567"}`}
        className="rounded-lg col-span-5 bg-blue-600 text-white p-2 text-sm flex justify-center gap-2 items-center hover:bg-blue-700 transition">
        <Phone size={15} />
        Llamada
      </a>

        <a href={`https://wa.me/${property.agent?.phone?.replace(/\D/g, '') || "525551234567"}`}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-lg col-span-5 bg-[#25D366] text-white p-2 text-sm flex justify-center gap-2 items-center hover:bg-[#20ba5a] transition">
        <Smartphone size={15} />
        WhatsApp
      </a>
    </div>
  );

  if (isModal) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
          className="border border-white/10 rounded-xl color3 px-2 py-1 shadow-xl w-full max-w-sm">
          <div className="flex justify-between items-center p-3 pb-1">
            <p className="text-[#FCA311] font-playfair text-lg">¿Interesado?</p>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">✕</button>
          </div>
          {content}
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="border border-white/10 rounded-xl color3 px-2 py-1 shadow-xl sticky top-4 h-fit">
      <p className="text-[#FCA311] p-3 pb-1 font-playfair text-lg">¿Interesado?</p>
      <p className="px-3 text-white text-sm">Contáctate con {property.agent?.name || "el agente"}</p>
      {content}
    </div>
  );
}