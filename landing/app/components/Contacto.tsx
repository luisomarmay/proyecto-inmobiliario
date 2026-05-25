"use client"
import { motion } from "framer-motion"
import { useState } from "react"
import { Mail, User, MessageSquare, Send } from "lucide-react"

export default function Contacto() {
    const [nombre, setNombre] = useState("")
    const [correo, setCorreo] = useState("")
    const [mensaje, setMensaje] = useState("")
    const [enviado, setEnviado] = useState(false)
    const [error, setError] = useState("")

    const enviar = async () => {
        if (!nombre || !correo || !mensaje) {
            setError("Por favor completa todos los campos.")
            return
        }
        try {
            const res = await fetch("http://localhost:3001/contacto", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre, correo, mensaje }),
            })
            if (!res.ok) throw new Error("Error al enviar")
            setEnviado(true)
            setError("")
            setNombre("")
            setCorreo("")
            setMensaje("")
        } catch {
            setError("Hubo un problema al enviar. Intenta de nuevo.")
        }
    }

    return (
        <motion.section
            id="contacto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-prusia py-24 px-16">
            <div className="text-center mb-14">
                <span className="text-naranja font-inter text-sm font-semibold uppercase tracking-widest">
                    Estamos para ayudarte
                </span>
                <h2 className="font-playfair text-4xl font-bold text-white mt-3">
                    Contáctanos
                </h2>
            </div>

            <div className="max-w-2xl mx-auto bg-white/5 border border-white/10 rounded-3xl p-10 backdrop-blur-sm">
                <div className="flex flex-col gap-5">
                    <div className="relative">
                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                            type="text"
                            placeholder="Nombre completo"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full font-inter bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-3.5
                            text-white placeholder:text-white/30 focus:outline-none focus:border-naranja transition-all duration-300"
                        />
                    </div>
                    <div className="relative">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            className="w-full font-inter bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-3.5
                            text-white placeholder:text-white/30 focus:outline-none focus:border-naranja transition-all duration-300"
                        />
                    </div>
                    <div className="relative">
                        <MessageSquare size={16} className="absolute left-4 top-5 text-white/40" />
                        <textarea
                            placeholder="¿En qué podemos ayudarte?"
                            rows={5}
                            value={mensaje}
                            onChange={(e) => setMensaje(e.target.value)}
                            className="w-full font-inter bg-white/10 border border-white/20 rounded-xl pl-11 pr-4 py-3.5
                            text-white placeholder:text-white/30 focus:outline-none focus:border-naranja transition-all duration-300 resize-none"
                        />
                    </div>

                    {error && <p className="text-red-400 text-sm font-inter text-center">{error}</p>}
                    {enviado && <p className="text-green-400 text-sm font-inter text-center">¡Mensaje enviado con éxito!</p>}

                    <button
                        onClick={enviar}
                        className="flex items-center justify-center gap-2 bg-naranja text-white font-inter font-semibold py-4 rounded-xl
                        transition-all duration-300 hover:brightness-110 hover:scale-[1.02] cursor-pointer shadow-lg shadow-naranja/30">
                        <Send size={16} />
                        Enviar mensaje
                    </button>
                </div>
            </div>
        </motion.section>
    )
}