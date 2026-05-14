export default function Navbar() {
    return (
        <nav className="flex justify-between items-center px-10 py-4 bg-oscuro shadow-md">
            <p className="text-xl font-inter font-bold">Sistema Inmobiliario</p>
            <ul className="flex gap-6">
             <li>Propiedades</li>
             <li>Nosotros</li>
             <li>Contacto</li>
            </ul>
        </nav>
    )
}