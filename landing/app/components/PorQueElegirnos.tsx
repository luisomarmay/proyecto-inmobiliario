import { Home, Handshake, FileText, MapPin } from "lucide-react"

const razones = [
  { id: 1, icono: <Home size={40} />, titulo: "Amplio catálogo", descripcion: "Cientos de propiedades en venta y renta en todo Yucatán." },
  { id: 2, icono: <Handshake size={40} />, titulo: "Asesores expertos", descripcion: "Te acompañamos en cada paso del proceso." },
  { id: 3, icono: <FileText size={40} />, titulo: "Contratos seguros", descripcion: "Documentación legal transparente y confiable." },
  { id: 4, icono: <MapPin size={40} />, titulo: "Ubicaciones premium", descripcion: "Las mejores zonas de Mérida y Yucatán." },
]

export default function PorQueElegirnos() {
    return (
        <section className="bg-white py-16 px-10">
            <h2 className="text-3xl font-playfair font-bold text-prusia text-center mb-10">
                ¿Por qué elegirnos?
            </h2>
            <div className="grid grid-cols-4 gap-6">
                {razones.map((razon) => (
                    <div key={razon.id} className="text-center p-6 rounded-xl border border-gray-100 shadow-sm">
                        <div className="flex justify-center text-naranja mb-4">{razon.icono}</div>
                        <h3 className="text-lg font-inter font-bold text-prusia mb-2">{razon.titulo}</h3>
                        <p className="text-gray-500 text-sm">{razon.descripcion}</p>
                    </div>
                )
            )}
            </div> 
        </section>
    )
}