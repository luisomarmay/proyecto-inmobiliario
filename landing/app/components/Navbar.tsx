export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-10 py-4 bg-oscuro/95 backdrop-blur-sm border-b border-white/10 shadow-lg">
            <p className="text-xl font-inter font-bold text-white tracking-wide">Sistema Inmobiliario</p>
            <ul className="flex gap-8 font-inter text-sm font-medium text-white/80">
                <a href="#propiedades" className="cursor-pointer transition-all duration-300 hover:text-naranja hover:tracking-wide">Propiedades</a>
                <a href="#nosotros" className="cursor-pointer transition-all duration-300 hover:text-naranja hover:tracking-wide">Nosotros</a>
                <a href="#contacto" className="cursor-pointer transition-all duration-300 hover:text-naranja hover:tracking-wide">Contacto</a>
            </ul>
        </nav>
    )
}