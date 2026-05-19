"use client";
import { useEffect, useState } from "react";
export default function Inmuebles() {
  const [properties, setProperties] = useState([]);
  useEffect(() => {
    fetch("http://localhost:3001/rent")
      .then((res) => res.json())
      .then((data) => {
        console.log("BACKEND DATA:", data);
        setProperties(data);
      });
  }, []);
  return (
    <div className="color4">
      <div className="grid p-16 grid-cols-4 gap-9 color5">
        {properties.map((property: any) => (
          <div
            className="card bg-base-100 w-full shadow-sm color4 shadow-2xl shadow-black/50 shadow-xl"
            key={property.id}
          >
            <figure className="h-50">
              <div className="carousel w-full">
                <div id="slide1" className="carousel-item relative w-full">
                  <img
                    className="w-full h-64 object-cover"
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
            <div className="card-body text-black">
                <p>{property.type}</p>
              <h2 className="card-title">
                Precio: {property.price.toLocaleString()} MXN
              </h2>
              <p>{property.title}</p>
              <p>Ciudad: {property.location}</p>
              <p>{property.bedrooms} Habitaciones</p>
               <p>{property.bathrooms} Baños</p>
              <div className="card-actions justify-end">
                <button className="btn color1 rounded-xl">Contactar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-4">
        <div className="join flex justify-center w-full">
          <button className="join-item btn color3">1</button>
          <button className="join-item btn color3">2</button>
          <button className="join-item btn color3">...</button>
          <button className="join-item btn color3">99</button>
          <button className="join-item btn color3">100</button>
        </div>
        </div>
    </div>
  );
}
