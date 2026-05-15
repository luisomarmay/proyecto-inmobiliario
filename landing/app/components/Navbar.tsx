export default function Navbar() {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-10 py-4 bg-oscuro shadow-md">
            <p className="text-xl font-inter font-bold">Sistema Inmobiliario</p>
            <ul className="flex gap-6 font-inter">
             <a href="#propiedades" className=" cursor-pointer transition-all duration-300 hover:text-naranja">Propiedades</a>
             <a href="#nosotros" className=" cursor-pointer transition-all duration-300 hover:text-naranja">Nosotros</a>
             <a href="#contacto" className=" cursor-pointer transition-all duration-300 hover:text-naranja">Contacto</a>
            </ul>
        </nav>
    )
}