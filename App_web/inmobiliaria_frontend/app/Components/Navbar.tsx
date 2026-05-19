export default function Navbar(){
    return(
        <div>
          <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-10 py-4 color1 shadow-md">
              <p className="text-xl font-inter font-bold">Sistema Inmobiliario</p>
              <ul className="flex gap-6 font-inter">
                <button className="color2 p-2 rounded-xl">Ingresar</button>
              </ul>
          </nav>
        </div>
    );
}