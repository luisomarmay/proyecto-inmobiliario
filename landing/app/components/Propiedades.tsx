"use client"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MapPin } from "lucide-react"
import { Bed, Bath } from "lucide-react"

export default function Propiedades() {
  const [propiedades, setPropiedades] = useState<any[]>([])

  useEffect(() => {
  fetch("http://localhost:3001/rent")
    .then(res => res.json())
    .then(data => {
      if (Array.isArray(data.properties)) {
        setPropiedades(data.properties)
      }
    })
    .catch(() => setPropiedades([]))
}, [])

    return (
        <motion.section
            id="propiedades"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-nieve py-24 px-16">
            <div className="text-center mb-14">
                <span className="text-naranja font-inter text-sm font-semibold uppercase tracking-widest">
                    Inmuebles disponibles
                </span>
                <h2 className="text-4xl font-playfair font-bold text-prusia mt-3">
                    Propiedades destacadas
                </h2>
            </div>
            <div className="grid grid-cols-3 gap-8">
                {propiedades.slice(0, 3).map((propiedad: any, i: number) => (
                    <motion.div
                        key={propiedad.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="group bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100
                        transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 cursor-pointer">
                        
                           <div className="relative h-48 overflow-hidden">
                           <img
                            src={propiedad.image}
                            alt={propiedad.title}
                            className="w-full h-full object-cover"
                            />
                            <span className="absolute top-4 left-4 text-xs font-inter font-semibold px-3 py-1 rounded-full bg-naranja text-white">
                           {propiedad.type}
                            </span>
                        </div>
                        <div className="p-6">
                            <h3 className="text-lg font-inter font-bold text-oscuro mb-1">{propiedad.title}</h3>
                            <p className="text-naranja font-inter font-bold text-xl mb-3">{propiedad.price} MX</p>
                             <span className="text-xs bg-naranja text-white px-3 py-1 rounded-full mt-2 inline-block">
                            {propiedad.type}
                            </span>
                            <div className="flex items-center gap-1 text-gray-400 text-sm mb-4">
                                <MapPin size={14} />
                                 <p className="text-gray-500 text-sm">{propiedad.address  || "Ubicación no disponible" }</p>
                            </div>
                            <span className="text-gray-500 flex items-center gap-1">
                        <Bed size={14} /> {propiedad.bedrooms} hab.
                       </span>
                    <span className="text-gray-500 flex items-center gap-1">
                    <Bath size={14} /> {propiedad.bathrooms} baños
                    </span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    )
}