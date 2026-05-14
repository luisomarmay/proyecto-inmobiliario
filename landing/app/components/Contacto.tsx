"use client"

import { useState } from "react"

export default function Contacto() {
    const [nombre, setNombre] = useState("")
    const [correo, setCorreo] = useState("")
    const [mensaje, setMensaje] = useState("")

    return (
        <section className="bg-nieve py-16 px-10">
            <h2 className="font-playfair text-3xl font-bold text-prusia text-center mb-10">
                Contáctanos
            </h2>

            <div className="max-w-xl mx-auto flex flex-col gap-4">
            <input type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={(e) => setNombre (e.target.value)}
            className="font-inter border border-gray-300 rounded-lg px-4 py-3 text-oscuro" />
            
            <input type="text"
            placeholder="Correo"
            value={correo}
            onChange={(e) => setCorreo (e.target.value)}
            className="font-inter border border-gray-300 rounded-lg px-4 py-3 text-oscuro" />

            <textarea
            placeholder="Mensaje"
            rows={5}
            value={mensaje}
            onChange={(e) => setMensaje (e.target.value)}
            className="font-inter border border-gray-300 rounded-lg px-4 py-3 text-oscuro" />

            <button className="bg-naranja text-white font-semibold py-3 rounded-b-lg">
                Enviar mensaje
            </button>
            </div>
        </section>
    )
}