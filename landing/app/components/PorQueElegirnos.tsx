"use client"
import { motion } from "framer-motion"
import { Home, Handshake, FileText, MapPin } from "lucide-react"

const razones = [
    { id: 1, icono: <Home size={32} />, titulo: "Amplio catálogo", descripcion: "Cientos de propiedades en venta y renta en todo Yucatán." },
    { id: 2, icono: <Handshake size={32} />, titulo: "Asesores expertos", descripcion: "Te acompañamos en cada paso del proceso de compra o renta." },
    { id: 3, icono: <FileText size={32} />, titulo: "Contratos seguros", descripcion: "Documentación legal transparente, clara y confiable." },
    { id: 4, icono: <MapPin size={32} />, titulo: "Ubicaciones premium", descripcion: "Las mejores zonas de Mérida y todo el estado de Yucatán." },
]

export default function PorQueElegirnos() {
    return (
        <motion.section
            id="nosotros"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white py-24 px-16">
            <div className="text-center mb-14">
                <span className="text-naranja font-inter text-sm font-semibold uppercase tracking-widest">
                    Nuestras ventajas
                </span>
                <h2 className="text-4xl font-playfair font-bold text-prusia mt-3">
                    ¿Por qué elegirnos?
                </h2>
            </div>
            <div className="grid grid-cols-4 gap-6">
                {razones.map((razon, i) => (
                    <motion.div
                        key={razon.id}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: i * 0.1 }}
                        className="group text-center p-8 rounded-2xl border border-gray-100 hover:border-naranja/30 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-default">
                        <div className="w-16 h-16 bg-naranja/10 rounded-2xl flex items-center justify-center text-naranja mx-auto mb-5
                        group-hover:bg-naranja group-hover:text-white transition-all duration-300">
                            {razon.icono}
                        </div>
                        <h3 className="text-base font-inter font-bold text-prusia mb-2">{razon.titulo}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{razon.descripcion}</p>
                    </motion.div>
                ))}
            </div>
        </motion.section>
    )
}