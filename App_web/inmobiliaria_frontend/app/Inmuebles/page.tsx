"use client";
import { useEffect, useState, useCallback } from "react";
import { BedDouble, Bath, Search, CarFront } from "lucide-react";

interface Filters {
  search: string;
  operation_type: string;
  property_type: string;
  bedrooms: string;
  max_price: string;
  page: number;
}

export default function Inmuebles() {
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState<Filters>({
    search: "",
    operation_type: "",
    property_type: "",
    bedrooms: "",
    max_price: "",
    page: 1,
  });

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.operation_type) params.set("operation_type", filters.operation_type);
      if (filters.property_type)  params.set("property_type", filters.property_type);
      if (filters.bedrooms)   params.set("bedrooms", filters.bedrooms);
      if (filters.max_price)      params.set("max_price", filters.max_price);
      params.set("page", String(filters.page));

      const res = await fetch(`http://localhost:3002/rent?${params.toString()}`);
      const data = await res.json();

      setProperties(data.properties);
      setPagination(data.pagination);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleFilter = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div className="color4">
      {/* Filtros */}
      <div className="py-4 px-4 color3 sticky top-0 z-50 border-b-2">
        <div className="grid grid-cols-7 gap-4 px-8 text-black">
          <div className="relative col-span-2">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Ingresar estados o colonias"
              className="shadow-md rounded-lg color5 py-3 pl-10 px-4 w-full"
              value={filters.search}
              onChange={(e) => handleFilter("search", e.target.value)}
            />
          </div>

          <select
            className="shadow-md rounded-lg color5 py-3 px-4 cursor-pointer field-sizing-content"
            value={filters.operation_type}
            onChange={(e) => handleFilter("operation_type", e.target.value)}
          >
            <option value="">Operación</option>  {/* ← agregado */}
            <option value="rental">Rentar</option>
            <option value="sale">Comprar</option>
            <option value="">Remates</option>
            <option value="">Temporal/Vacacional</option>
            <option value="">Desarrollo</option>
            <option value="">Traspaso</option>
          </select>

          <select
            className="shadow-md rounded-lg color5 py-3 flex px-4 cursor-pointer field-sizing-content"
            value={filters.property_type}
            onChange={(e) => handleFilter("property_type", e.target.value)}
          >
            <option value="">Tipo</option>
            <option value="Departamento">Departamento</option>
            <option value="Casa">Casa</option>
            <option value="Terreno">Terreno</option>
            <option value="Local">Local</option>
            <option value="Local comercial">Local Comercial</option>
            <option value="Oficina">Oficina</option>
          </select>

          <select
            className="shadow-md rounded-lg color5 py-3 flex px-4 cursor-pointer field-sizing-content"
            value={filters.bedrooms}
            onChange={(e) => handleFilter("bedrooms", e.target.value)}
          >
            <option value="">Recamaras</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>

          <select
            className="shadow-md rounded-lg color5 py-3 flex px-4 cursor-pointer field-sizing-content"
            value={filters.max_price}
            onChange={(e) => handleFilter("max_price", e.target.value)}
          >
            <option value="">Precio</option>
            <option value="1000">1,000</option>
            <option value="2000">2,000</option>
            <option value="3000">3,000</option>
          </select>

          <button className="shadow-md rounded-lg color5 py-3 flex px-4 cursor-pointer field-sizing-content">
            Mas filtros
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid p-16 grid-cols-4 gap-9 color5 pt-6 pb-12 px-12">
        {loading ? (
          <p className="col-span-4 text-center py-10">Cargando...</p>
        ) : properties.length === 0 ? (
          <p className="col-span-4 text-center py-10">Sin resultados</p>
        ) : (
          properties.map((property: any) => (
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
                      <a href="#slide4" className="btn btn-circle btn-ghost">❮</a>
                      <a href="#slide2" className="p-1 btn btn-circle btn-ghost">❯</a>
                    </div>
                  </div>
                </div>
              </figure>
              <div className="card-body text-black pt-3 flex flex-col">
                {<h2 className="card-title text-[#14213D]">
                  ${property.price?.toLocaleString()} MXN 
                </h2>}
                <h3 className="line-clamp-2 text-[#14213D] min-h-[42px]" title={property.title}>
                  {property.title}
                </h3>
                <h4 className="line-clamp-2 opacity-75 min-h-[42px]" title={property.location}>
                  {property.location}
                </h4>
                <div className="grid grid-cols-3 gap-8">
                  <div className="flex px-4 gap-2 pb-2"><BedDouble /><p className="pt-1">{property.bedrooms}</p></div>
                  <div className="flex gap-2 px-4"><Bath /><p className="pt-1">{property.bathrooms}</p></div>
                  <div className="flex gap-2 px-4"><CarFront /><p className="pt-1">{property.parking}</p></div>
                </div>
                <div className="card-actions mt-auto">
                  <button className="btn bg-[#14213D] border-[#14213D] text-white hover:text-black hover:bg-white w-full shadow-md rounded-gl cursor-pointer">
                    Contactar
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Paginación */}
      {pagination && (  /* ← agregado guard */
        <div className="join flex justify-center w-full pb-10">
          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setFilters((prev) => ({ ...prev, page: p }))}
              className={`join-item btn border-[#14213D] ${
                filters.page === p
                  ? "bg-[#14213D] text-white"
                  : "bg-[#F8F9FA] text-[#14213D] hover:text-white hover:bg-[#14213D]"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}