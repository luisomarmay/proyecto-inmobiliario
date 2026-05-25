export default function Navbar() {
  return (
    <div>
      <nav className="top-0 left-0 right-0 z-50 flex justify-between items-center px-12 py-3 color3 shadow-md">
        <p className="text-xl font-inter font-bold">Sistema Inmobiliario</p>
        {/* <ul className="flex justify-start">Comprar</ul> */}
        <ul className="flex gap-6 font-inter">
          <a 
          href="http://localhost:3004/login"
          className="bg-[#FCA311] text-white hover:text-black p-2 px-4 rounded-lg cursor-pointer hover:bg-[#F8F9FA] transition duration-300"
          >
          Ingresar
        </a>
        </ul>
      </nav>
    </div>
  );
}
