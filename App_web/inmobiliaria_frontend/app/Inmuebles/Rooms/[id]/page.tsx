"use client";
import {
  Share,
  Heart,
  MapPin,
  BedDouble,
  Bath,
  CarFront,
  Ruler,
  Smartphone,
  Mail,
  ArrowLeft,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import MapaSingle from "../../../Components/MapaSingle";

export default function Information() {
  const { id } = useParams();
  const router = useRouter();
  const [favorito, setFavorito] = useState(false);
  const [property, setProperty] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    fetch(`http://localhost:3002/rent/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("property data:", data);
        setProperty(data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center py-20">Cargando...</p>;
  if (!property)
    return <p className="text-center py-20">Propiedad no encontrada</p>;

  return (
    <div>
      <section className="py-3 px-8 color4">
        {/* Titulo y botones */}
        <div className="flex items-center justify-between">
          <div>
            <button
              className="text-[#14213d] flex gap-2 font-bold text-sm"
              onClick={() => router.back()}
            >
              <ArrowLeft size={18} />
              <span>Volver a propiedades</span>
            </button>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              className="flex items-center gap-2 border border-[#14213d] rounded-lg px-3 py-1.5 color5 text-sm"
              onClick={() => setFavorito(!favorito)}
            >
              <span className="text-[#14213d]">Favorito</span>
              <Heart
                size={16}
                className={
                  favorito ? "fill-red-500 text-red-500" : "text-[#14213d]"
                }
              />
            </button>
            <button className="flex border rounded-lg px-3 py-1.5 gap-2 border-[#14213d] color5 items-center text-sm">
              <span className="text-[#14213d]">Compartir</span>
              <Share size={16} className="text-[#14213d]" />
            </button>
          </div>
        </div>

        {/* Card principal */}
        <div className="p-4 color5 rounded-xl my-2 border shadow border-black/20">
          <h1 className="text-2xl font-playfair text-[#14213d] mb-3">
            {property.title}
          </h1>

          {/* Imágenes */}
          {/* Imágenes */}
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[380px]">
            {property.images?.slice(0, 5).map((img: string, i: number) => (
              <div
                key={i}
                onClick={() => {
                  setLightboxIndex(i);
                  setLightboxOpen(true);
                }}
                className={`overflow-hidden shadow border-2 border-white/80 cursor-pointer
        ${i === 0 ? "col-span-2 row-span-2 rounded-l-xl" : ""}
        ${i === 2 ? "rounded-tr-xl" : ""}
        ${i === 4 ? "rounded-br-xl" : ""}
      `}
              >
                <img
                  className="object-cover w-full h-full hover:brightness-75 transition-all"
                  src={img}
                  alt=""
                />
              </div>
            ))}
          </div>

          {/* Lightbox */}
          {lightboxOpen && (
            <div
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center"
              onClick={() => setLightboxOpen(false)}
            >
              <button
                className="absolute left-6 text-white text-3xl p-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(
                    (prev) =>
                      (prev - 1 + property.images.length) %
                      property.images.length,
                  );
                }}
              >
                ❮
              </button>
              <img
                src={property.images[lightboxIndex]}
                className="max-h-[85vh] max-w-[80vw] rounded-xl shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              />
              <button
                className="absolute right-6 text-white text-3xl p-2"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(
                    (prev) => (prev + 1) % property.images.length,
                  );
                }}
              >
                ❯
              </button>
              <button
                className="absolute top-4 right-6 text-white text-2xl"
                onClick={() => setLightboxOpen(false)}
              >
                ✕
              </button>
              <p className="absolute bottom-6 text-white text-sm">
                {lightboxIndex + 1} / {property.images.length}
              </p>
            </div>
          )}

          {/* Info del inmueble */}
          <div className="grid grid-cols-3 mt-6 gap-5">
            {/* Izquierda */}
            <div className="col-span-2 text-[#14213d]">
              <h1 className="text-xl">
                {property.service} desde{" "}
                <span>${property.price?.toLocaleString()} MXN</span>
              </h1>
              <p className="flex gap-2 pt-1.5 border-b pb-3 text-sm items-center">
                <MapPin size={15} />
                {property.location}
              </p>
              <div className="grid grid-cols-4 gap-3 mt-4 border-b pb-4 text-sm">
                <div className="flex gap-2 items-center">
                  <BedDouble size={16} />
                  {property.bedrooms}
                </div>
                <div className="flex gap-2 items-center">
                  <Bath size={16} />
                  {property.bathrooms}
                </div>
                <div className="flex gap-2 items-center">
                  <CarFront size={16} />
                  {property.parking}
                </div>
                <div className="flex gap-2 items-center">
                  <Ruler size={16} />
                  {property.construction_size
                    ? `${property.construction_size} m²`
                    : property.lot_size
                      ? `${property.lot_size} m²`
                      : "N/A"}
                </div>
              </div>
              <div className="mt-4 border-b pb-4">
                <p className="flex gap-2 pb-3 text-sm items-center">
                  <MapPin size={15} />
                  {property.location}
                </p>
                {property.lat && property.lng ? (
                  <div className="overflow-hidden rounded-lg h-[300px]">
                    <MapaSingle lat={property.lat} lng={property.lng} />
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-lg h-[300px] bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                    <MapPin size={20} className="mr-2" />
                    Ubicación no disponible
                  </div>
                )}
              </div>
              <div className="mt-4 border-b pb-4">
                <h1 className="text-lg mb-2">Descripción</h1>
                <p className="text-sm leading-relaxed">
                  {property.description || "Sin descripción disponible."}
                </p>
              </div>
            </div>

            {/* Derecha - Formulario */}
            <div className="border border-white/10 rounded-xl color3 px-2 py-1 shadow-xl sticky top-4 h-fit">
              <p className="text-[#FCA311] p-3 pb-1 font-playfair text-lg">
                ¿Interesado?
              </p>
              <p className="px-3 text-white text-sm">
                Contáctate con {property.agent?.name || "el agente"}
              </p>
              <div className="grid grid-cols-5 gap-2 m-3">
                <input
                  className="col-span-2 text-white border-2 color3 border-slate-600/40 rounded-lg p-2 text-sm focus:outline-2 focus:outline-[#FCA311]"
                  type="text"
                  placeholder="Nombre"
                />
                <input
                  className="col-span-3 text-white border-2 color3 border-slate-600/40 rounded-lg p-2 text-sm focus:outline-2 focus:outline-[#FCA311]"
                  type="email"
                  placeholder="E-mail"
                />
                <select className="border-slate-600/40 color3 text-white p-2 text-sm border-2 rounded-lg focus:outline-2 focus:outline-[#FCA311]">
                  <option className="color2 text-white" value="1">
                    1
                  </option>
                  <option className="color2 text-white" value="2">
                    2
                  </option>
                  <option className="color2 text-white" value="3">
                    3
                  </option>
                  <option className="color2 text-white" value="4">
                    4
                  </option>
                  <option className="color2 text-white" value="5">
                    5
                  </option>
                </select>
                <input
                  type="tel"
                  className="col-span-4 border-slate-600/40 color3 text-white rounded-lg p-2 text-sm border-2 focus:outline-2 focus:outline-[#FCA311]"
                  placeholder="Telefono"
                />
                <textarea
                  placeholder="Mensaje"
                  className="text-white h-[80px] color3 border-slate-600/40 border-2 rounded-lg p-2 text-sm col-span-5 resize-none focus:outline-2 focus:outline-[#FCA311]"
                />
                <button className="rounded-lg col-span-5 bg-[#FCA311] text-black p-2 text-sm flex justify-center gap-2 items-center">
                  <Mail size={15} />
                  Contactar por correo electrónico
                </button>
                <button className="text-black rounded-lg col-span-5 bg-[#25D366] p-2 text-sm flex gap-2 justify-center items-center">
                  <Smartphone size={15} />
                  Contactar por WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
