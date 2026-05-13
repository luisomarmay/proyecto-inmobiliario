import {Smartphone, Mail, MapPin } from "lucide-react"

export default function Footer(){
    return(
        <footer className="bg-prusia text-white py-12 px-20">
            <div className="grid grid-cols-3 gap-8">
                <div>
                    <h3 className="text-naranja text-xl font-bold mb-4">InmoSistema</h3>
                    <p className="text-gray-400 text-sm">
                        Tu aliado de confianza en bienes raíces en Yucatán
                    </p>
                </div>

                <div>
                    <h3 className="text-white font-bold mb-4">Enlaces</h3>
                    <ul className="space-y-2 text-gray-400 text-sm">
                        <li>Propiedades</li>
                        <li>Nosotros</li>
                        <li>Contactanos</li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-white font-boldmb-4">Contacto</h3>
                    <ul className="space-y-2 text-gray-400 text-smn">
                        <li className="flex items-center gap-2"><Smartphone size={16}/> 999 123 4567</li>
                        <li className="flex items-center gap-2"><Mail size={16}/>contacto@inmosistema.mx</li>
                        <li className="flex items-center gap-2"><MapPin size={16}/>Mérida, Yucatán</li>
                    </ul>
                </div>

                </div>
                <p className="text-center text-gray-500 text-xs mt-10">
                    © 2025 InmoSistema. Todos los derechos reservados.  
                </p>
        </footer>
    )
}