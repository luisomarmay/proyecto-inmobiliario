"use client";
import { useEffect, useState } from "react";
import { BedDouble, Bath, Search, CarFront } from "lucide-react";
export default function Inmuebles() {
  const [properties, setProperties] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3002/rent")
      .then((res) => res.json())
      .then((data) => {
        console.log("BACKEND DATA:", data);
        setProperties(data);
      });
  }, []);
  return (
    <div className="color4">
      {/* Filtros */}
      <div className="py-4 px-4 color4  sticky top-0 z-50 border-b-2">
        <div className="grid grid-cols-7 gap-4 px-8 text-black">
          <div className="relative col-span-2">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />

            <input
              type="text"
              placeholder="Ingresar estados o colonias"
              className="shadow-md rounded-lg color5 py-3 pl-10 px-4 w-full"
            />
          </div>
          <select className="shadow-md rounded-lg color5 py-3 px-4 cursor-pointer field-sizing-content">
            <option value="">Rentar</option>
            <option value="">Comprar</option>
            <option value="">Remates</option>
            <option value="">Temporal/Vacacional</option>
            <option value="">Desarrollo</option>
            <option value="">Traspaso</option>
          </select>
          <select className="shadow-md rounded-lg color5 py-3 flex px-4 cursor-pointer field-sizing-content">
            <option value="">Departamento</option>
            <option value="">Casa</option>
            <option value="">Terreno</option>
            <option value="">Casa en condominio</option>
            <option value="">Local comercial</option>
            <option value="">Bodega comercial</option>
          </select>
          <select className="shadow-md rounded-lg color5 py-3 flex px-4 cursor-pointer field-sizing-content">
            <option value="">Recamaras</option>
            <option value="">1</option>
            <option value="">2</option>
            <option value="">3</option>
          </select>
          <select className="shadow-md rounded-lg color5 py-3 flex  px-4 cursor-pointer field-sizing-content">
            <option value="">Precio</option>
            <option value="">1,000</option>
            <option value="">2,000</option>
            <option value="">3,000</option>
          </select>
          <button className="shadow-md rounded-lg color5 py-3 flex  px-4 cursor-pointer field-sizing-content">
            Mas filtros
          </button>
        </div>
      </div>
      {/* Filtros */}
      <div className="grid p-16 grid-cols-4 gap-9 color5 pt-6 pb-12 px-12">
        {properties.map((property: any) => (
          <div
            className="card bg-base-100 w-full shadow-sm color4 shadow-2xl shadow-black/50 shadow-xl"
            key={property.id}
          >
            <figure className="h-50">
              <div className="carousel w-full">
                <div id="slide1" className="carousel-item relative w-full">
                  <img
                    className="w-full h-64 object-cover cursor-pointer"
                    src={property.image}
                  />
                  <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a href="#slide4" className="btn btn-circle  btn-ghost">
                      ❮
                    </a>
                    <a href="#slide2" className="p-1 btn btn-circle btn-ghost">
                      ❯
                    </a>
                  </div>
                </div>
              </div>
            </figure>
            <div className="card-body text-black pt-3 flex flex-col">
              {/*  <p>{property.type}</p> */}
              <h2 className="card-title text-[#14213D] ">
                ${property.price.toLocaleString()} MXN
              </h2>
              <h3
                className="line-clamp-2 text-[#14213D] min-h-[42px]"
                title={property.title}
              >
                {property.title}
              </h3>
              <h4
                className="line-clamp-2 opacity-75 min-h-[42px]"
                title={property.location}
              >
                {property.location}
              </h4>
              <div className="grid grid-cols-3 gap-8">
                <div className="flex px-4 gap-2 pb-2">
                  <BedDouble />
                  <p className="pt-1">{property.bedrooms}</p>
                </div>
                <div className="flex gap-2 px-4">
                  <Bath />
                  <p className="pt-1">{property.bathrooms}</p>
                </div>
                <div className="flex gap-2 px-4">
                  <CarFront />
                  <p className="pt-1">{property.parking}</p>
                </div>
              </div>
              <div className="card-actions mt-auto">
                <button className="btn bg-[#F8F9FA] border-[#14213D] text-[#14213D] hover:text-white hover:bg-[#14213D] w-full shadow-md rounded-gl cursor-pointer">
                  Contactar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="join flex justify-center w-full  pb-10">
        <button className="join-item btn bg-[#F8F9FA] border-[#14213D] text-[#14213D] hover:text-white hover:bg-[#14213D]">1</button>
        <button className="join-item btn bg-[#F8F9FA] border-[#14213D] text-[#14213D] hover:text-white hover:bg-[#14213D]">2</button>
        <button className="join-item btn bg-[#F8F9FA] border-[#14213D] text-[#14213D] hover:text-white hover:bg-[#14213D]">...</button>
        <button className="join-item btn bg-[#F8F9FA] border-[#14213D] text-[#14213D] hover:text-white hover:bg-[#14213D]">99</button>
        <button className="join-item btn bg-[#F8F9FA] border-[#14213D] text-[#14213D] hover:text-white hover:bg-[#14213D]">100</button>
      </div>
    </div>
  );
}
