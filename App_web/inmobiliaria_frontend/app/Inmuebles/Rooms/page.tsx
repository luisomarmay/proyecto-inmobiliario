import {
  Share,
  Heart,
  MapPin,
  BedDouble,
  Bath,
  CarFront,
  Ruler,
  Smartphone,
  Mail
} from "lucide-react";
export default function Information() {
  return (
    <div>
      <section className="py-5 px-12">
        {/* Titulo y botones */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl">Linda Hab. en Hotel Boutique - Céntrico</h1>
          <div className="flex gap-2 justify-end">
            <button className="flex items-center gap-2 border rounded-lg px-2 py-2">
              Favorito
              <Heart />
            </button>
            <button className="flex border rounded-lg px-2 py-2 gap-2 items-center">
              Compartir
              <Share />
            </button>
          </div>
        </div>
        {/* Titulo y botones */}

        {/* imagenes */}
        <div className="grid grid-cols-4 grid-rows-2 gap-4 pt-1 h-[450px] pt-4 ">
          <div className="col-span-2 row-span-2 color1 rounded-l-xl overflow-hidden">
            <img
              className="object-cover w-full h-full"
              src="https://hips.hearstapps.com/hmg-prod/images/gam-tici-300dpi-foto-gabriela-daltro-7-65ae44fd17c34.jpg?crop=0.648xw:1.00xh;0.314xw,0&resize=1120:*"
              alt=""
            />
          </div>
          <div className="color3">
            <img
              className="object-cover w-full h-full"
              src="https://hips.hearstapps.com/hmg-prod/images/2-6638d5d9a765c.png?crop=0.565xw:1.00xh;0.0407xw,0&resize=1200:*"
              alt=""
            />
          </div>
          <div className="color3 rounded-tr-xl overflow-hidden">
            <img
              className="object-cover w-full h-full"
              src="https://www.livitum.com/blogs/3/1/3/tx_62cbd1d3-f294-47ff-915e-330f98ea3a5e_salones_con_acentos_de_color_21.jpg"
              alt=""
            />
          </div>
          <div className="color3">
            <img
              className="object-cover w-full h-full"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRibM18RAuFZddSOwL-3uza_1dTieSRtRxJ3Q&s"
              alt=""
            />
          </div>
          <div className="color3 rounded-br-xl overflow-hidden">
            <img
              className="object-cover w-full h-full"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpnjrWLpeMCTDEUn5zGn4ysJuRswn0m1s_zA&s"
              alt=""
            />
          </div>
        </div>
        {/* imagenes */}

        {/* informacion del inmueble */}
        <div className="grid grid-cols-3  mt-8  gap-6 ">
          {/* Parte izquierda */}
          <div className="col-span-2  ">
            <h1 className="text-2xl">Renta Desde MN 23,500</h1>
            <p className="flex gap-2 pt-2 border-b pb-4">
              <MapPin />
              Cuajimalpa de Morelos, Santa Fe Cuajimalpa, Cuajimalpa de Morelos
            </p>
            <div className="grid grid-cols-4 gap-4 mt-6 border-b pb-5">
              <div className=" flex gap-4">
                <BedDouble />1 a 2 rec.
              </div>
              <div className=" flex gap-4">
                <Bath />1 a 2 Baños
              </div>
              <div className=" flex gap-4">
                <CarFront />
                Estacionamientos
              </div>
              <div className=" flex gap-4">
                <Ruler />
                57 m² lote
              </div>
            </div>
            <div className=" mt-6 border-b pb-5">
              <p className="flex gap-2  pb-5">
                <MapPin />
                Cuajimalpa de Morelos, Santa Fe Cuajimalpa, Cuajimalpa de
                Morelos
              </p>
              <div className="color2">
                <img
                  src="https://img10.naventcdn.com/ficha/map/Inmuebles24/141933064Z.png"
                  alt=""
                />
              </div>
            </div>
            <div className=" mt-6 border-b pb-5">
              <h1 className="text-xl">Descripción</h1>
              <p>
                Renta sin Aval en 24 horas. Proceso ágil y flexible. / Lease
                without guarantor with agile and flexible processes in 24 hours.
                Opción de departamentos amueblados por Bo-Concept. / Furnished
                apartments by Bo-Concept available. Todos los departamentos
                incluyen electrodomésticos. (microondas, lava-secadora,
                Refrigerador, estufa con horno, lavavajillas) persianas /
                canceles. All apartments include appliances. (microwave,
                washer-dryer, refrigerator, stove with oven, dishwasher) blinds
                / gates. !ESTRENA depa en la Torre mas emblemática de la CDMX!
                Brand new apartments just released to the market in the most
                iconic tower in CDMX. Departamentos tipo: Loft, 1 y 2 recámaras;
                a un minuto de Bosques de las Lomas y Arcos Bosques (El
                Pantalón) en medio de escuelas , universidades, hospitales,
                centros comerciales y toda la oferta de servicios que ofrecen
                Santa Fe y Bosques. Potencializa tu vida con nuestras
                amenidades: Alberca Co-Working Bar Cafetería Salón de Fiestas
                Game Room Chill Spot Pet Zone Área de asadores con fogateros
                Gimnasio Yoga Room Motor Lobby Sala de recepción Concierge
                Vigilancia 24hrs CCTV Shuttle que te conecta con los principales
                puntos de la CDMX y Santa Fe. RENTA SIN AVAL; Departamentos
                NUEVOS, Totalmente equipados con electrodomesticos nuevos,
                agenda una cita y prepara todo para estrenar!!
              </p>
            </div>
          </div>
          {/* Parte izquierda */}
          {/* Parte derecha */}
          <div className="border rounded-xl h-[415px] sticky top-6 z-12">
            <p className="p-4">
              Contáctate con Riğa Bosques por el desarrollo en Santa Fe
              Cuajimalpa, Cuajimalpa de Morelos
            </p>
            <div className="grid grid-cols-5 gap-3 m-4">
              <input className="col-span-2 color2 border rounded-lg p-3" type="text" placeholder="Nombre" />

              <input className="color2 col-span-3 border rounded-lg p-3" type="e-mail" placeholder="E-mail" />

              <select className="color2 p-3 border rounded-lg" name="" id="">
                <option value="">1</option>
                <option value="">2</option>
                <option value="">3</option>
                <option value="">4</option>
                <option value="">5</option>
              </select>

              <input type="tel" className="col-span-4 color2 rounded-lg p-3 border" placeholder="Telefono"/>

              <input type="text" placeholder="Mensaje" className="border rounded-lg p-3 col-span-5 color2"/>

              <button className="border rounded-lg col-span-5 color1 p-3 flex justify-center gap-2">
                <Mail/>
                Contactar
              </button>
              <button className="border rounded-lg col-span-5 bg-[#25D366] p-3 flex gap-2 justify-center">
                <Smartphone />
                Contactar por WhatsApp
              </button>
            </div>

          </div>
          {/* Parte derecha */}
        </div>
        {/* informacion del inmueble */}
      </section>
    </div>
  );
}
