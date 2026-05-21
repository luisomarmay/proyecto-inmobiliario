"use client"
import { motion } from "framer-motion"
import { useState, useEffect } from "react"

export default function Hero() {

    const [propiedad, setPropiedades] = useState<any>(null)

    useEffect(() => {
    fetch("http://localhost:3002/rent")
    .then(res => res.json())
    .then(data => setPropiedades(data[4]))
    }, [])

    return (
        
        <section className="bg-prusia min-h-screen flex items-center px-16 gap-16 pt-20">

            <motion.div
                initial={{ opacity: 0, x: -80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="w-1/2 flex flex-col gap-8">
                
                <h1 className="text-white font-playfair text-6xl font-bold leading-tight">
                    Encuentra la propiedad de tus <span className="text-naranja">sueños</span>
                </h1>
                <p className="text-white/60 font-inter text-lg leading-relaxed">
                    Compra, vende o renta con los mejores asesores de Yucatán. Más de 500 propiedades disponibles.
                </p>
                <div className="flex gap-4">
                    <a 
                    href="http://localhost:3000/Inmuebles"
                    className="bg-naranja text-white font-inter text-base font-semibold px-8 py-3 rounded-full
                    transition-all duration-300 hover:brightness-110 hover:scale-105 cursor-pointer shadow-lg shadow-naranja/30">
                        Ver propiedades
                    </a>
                    <a 
                    href="#contacto"
                    className="border border-white/30 text-white font-inter text-base font-medium px-8 py-3 rounded-full
                    transition-all duration-300 hover:bg-white/10 cursor-pointer">
                        Contáctanos
                    </a>
                </div>
                <div className="flex gap-10 mt-4 border-t border-white/10 pt-6">
                    <div>
                        <p className="text-naranja font-playfair text-3xl font-bold">500+</p>
                        <p className="text-white/50 font-inter text-sm">Propiedades</p>
                    </div>
                    <div>
                        <p className="text-naranja font-playfair text-3xl font-bold">12+</p>
                        <p className="text-white/50 font-inter text-sm">Años de experiencia</p>
                    </div>
                    <div>
                        <p className="text-naranja font-playfair text-3xl font-bold">98%</p>
                        <p className="text-white/50 font-inter text-sm">Clientes satisfechos</p>
                    </div>
                </div>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="w-1/2 relative">
                <div className="absolute -inset-4 bg-naranja/20 rounded-3xl blur-2xl" />
                <img
                    src={propiedad?.image || "/casa-yucatan.jpg"}
                    alt="propiedad destacada"
                    className="relative rounded-2xl w-full h-[580px] object-cover shadow-2xl border border-white/10"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-oscuro/80 backdrop-blur-sm rounded-xl px-5 py-4 border border-white/10">
                    <p className="text-white font-inter font-semibold text-sm">Propiedad destacada</p>
                    <p className="text-white/60 font-inter text-xs mt-1"> {propiedad?.title} · ${propiedad?.price || "$3,200,000 MXN"}</p>
                </div>
            </motion.div>
        </section>
    )
}