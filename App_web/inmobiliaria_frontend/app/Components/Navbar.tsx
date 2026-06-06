export default function Navbar() {
  return (
    <div>
      <nav className="color1 top-0 left-0 right-0 z-50 flex justify-between items-center px-12 py-4 bg-oscuro/95 backdrop-blur-sm border-b border-white/10 shadow-xl/30">
        <p className="text-xl font-inter font-bold font-playfair text-white">Sistema Inmobiliario</p>
        {/* <ul className="flex justify-start">Comprar</ul> */}
        <ul className="flex gap-6 font-inter">
          <a 
          href="http://localhost:3003/login"
          className="bg-[#14213d] border border-[#fca311] text-white  p-2 px-4 rounded-lg cursor-pointer hover:bg-[#fca311] transition duration-300"
          >
          Ingresar
        </a>
        </ul>
      </nav>
    </div>
  );
}
