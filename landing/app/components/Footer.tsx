import { Smartphone, Mail, MapPin } from "lucide-react"

export default function Footer() {
    return (
        <footer className="bg-oscuro text-white py-16 px-16 border-t border-white/10">
            <div className="grid grid-cols-3 gap-12 mb-12">
                <div>
                    <h3 className="text-naranja text-xl font-playfair font-bold mb-3">Sistema Inmobiliario</h3>
                    
                </div>
                <div>
                    <h3 className="text-white font-inter font-bold mb-4 text-sm uppercase tracking-widest">
                        Navegación
                    </h3>
                    <ul className="space-y-3 text-white/50 text-sm font-inter">
                        {["Propiedades", "Nosotros", "Contáctanos"].map((item) => (
                            <li key={item} className="cursor-pointer hover:text-naranja transition-colors duration-200">{item}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <h3 className="text-white font-inter font-bold mb-4 text-sm uppercase tracking-widest">
                        Contacto
                    </h3>
                    <ul className="space-y-3 text-white/50 text-sm font-inter">
                        <li className="flex items-center gap-3 hover:text-naranja transition-colors duration-200 cursor-pointer">
                            <Smartphone size={15} className="text-naranja" /> 999 123 4567
                        </li>
                        <li className="flex items-center gap-3 hover:text-naranja transition-colors duration-200 cursor-pointer">
                            <Mail size={15} className="text-naranja" /> contacto@inmosistema.mx
                        </li>
                        <li className="flex items-center gap-3">
                            <MapPin size={15} className="text-naranja" /> Mérida, Yucatán
                        </li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-white/10 pt-8 flex justify-between items-center">
                <p className="font-inter text-white/30 text-xs">
                    © 2025 Sistema inmobiliario. Todos los derechos reservados.
                </p>
               
            </div>
        </footer>
    )
}