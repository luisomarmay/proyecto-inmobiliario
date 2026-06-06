"use client";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Heart,
  MapPin,
  BedDouble,
  Bath,
  Ruler,
  CarFront,
  MessageCircleMore,
} from "lucide-react";
import MapaProperties from "../Components/MapaProperties";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

interface Filters {
  search: string;
  operation_type: string;
  property_type: string;
  bedrooms: string;
  max_price: string;
  page: number;
}

export default function Inmueble() {
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [cache, setCache] = useState<Record<number, any[]>>({});
  const [imageIndexes, setImageIndexes] = useState<Record<string, number>>({});
  const [favoritos, setFavoritos] = useState<Set<string>>(new Set());

  const toggleFavorito = (id: string) => {
    setFavoritos((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const [filters, setFilters] = useState<Filters>({
    search: "",
    operation_type: "",
    property_type: "",
    bedrooms: "",
    max_price: "",
    page: 1,
  });

  const getImageIndex = (id: string) => imageIndexes[id] || 0;

  const prevImage = (e: React.MouseEvent, id: string, total: number) => {
    e.preventDefault();
    e.stopPropagation();
    setImageIndexes((prev) => ({
      ...prev,
      [id]: (getImageIndex(id) - 1 + total) % total,
    }));
  };

  const nextImage = (e: React.MouseEvent, id: string, total: number) => {
    e.preventDefault();
    e.stopPropagation();
    setImageIndexes((prev) => ({
      ...prev,
      [id]: (getImageIndex(id) + 1) % total,
    }));
  };

  const fetchProperties = useCallback(async () => {
    if (cache[filters.page]) {
      setProperties(cache[filters.page]);
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.operation_type)
        params.set("operation_type", filters.operation_type);
      if (filters.property_type)
        params.set("property_type", filters.property_type);
      if (filters.bedrooms) params.set("bedrooms", filters.bedrooms);
      if (filters.max_price) params.set("max_price", filters.max_price);
      params.set("page", String(filters.page));

      const res = await fetch(
        `http://localhost:3002/rent?${params.toString()}`,
      );
      const data = await res.json();
      console.log("pagination recibida:", data.pagination);

      setProperties(data.properties);
      setPagination(data.pagination);
      setCache((prev) => ({ ...prev, [filters.page]: data.properties }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, cache]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const handleFilter = (key: keyof Filters, value: string) => {
    setCache({});
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  return (
    <div>
      {/* Header / Filtros */}
      <section className="py-3 px-2 flex gap-6 color3 border-b items-center border-white/10 shadow-lg sticky top-0 z-12">
        <div className="ml-8 min-w-[160px]">
          <p className="font-playfair text-xl text-white">Encuentra tu</p>
          <p className="text-xl font-playfair text-[#fca311]">próximo hogar</p>
        </div>
        <div className="grid grid-cols-8 color4 shadow h-[60px] items-center px-3 gap-2 rounded-xl mr-8 w-full">
          <div className="col-span-3 relative">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Ingresar estados o colonias"
              className="shadow rounded-lg color5 border border-black/10 py-2 pl-9 pr-3 w-full text-black text-sm focus:outline-2 focus:outline-[#FCA311]"
              value={filters.search}
              onChange={(e) => handleFilter("search", e.target.value)}
            />
          </div>
          <select
            className="py-2 px-3 cursor-pointer rounded-lg h-[40px] w-full color5 border border-black/10 text-black text-sm focus:outline-2 focus:outline-[#FCA311] shadow"
            value={filters.operation_type}
            onChange={(e) => handleFilter("operation_type", e.target.value)}
          >
            <option value="">Operacion</option>
            <option value="rental">Rentar</option>
            <option value="sale">Comprar</option>
            <option value="">Remates</option>
            <option value="">Temporal/Vacacional</option>
            <option value="">Desarrollo</option>
            <option value="">Traspaso</option>
          </select>
          <select
            className="shadow py-2 px-3 cursor-pointer rounded-lg h-[40px] border border-black/10 text-black text-sm color5 focus:outline-2 focus:outline-[#FCA311]"
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
            className="shadow py-2 px-3 cursor-pointer rounded-lg h-[40px] border border-black/10 text-black text-sm color5 focus:outline-2 focus:outline-[#FCA311]"
            value={filters.bedrooms}
            onChange={(e) => handleFilter("bedrooms", e.target.value)}
          >
            <option value="">Recamaras</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
          <select
            className="shadow py-2 px-3 cursor-pointer rounded-lg h-[40px] border border-black/10 text-black text-sm color5 focus:outline-2 focus:outline-[#FCA311]"
            value={filters.max_price}
            onChange={(e) => handleFilter("max_price", e.target.value)}
          >
            <option value="">Precio</option>
            <option value="1000">1,000</option>
            <option value="2000">2,000</option>
            <option value="3000">3,000</option>
          </select>
          <button className="shadow color2 rounded-lg py-2 px-3 w-full h-[40px] text-sm cursor-pointer">
            Más filtros
          </button>
        </div>
      </section>

      {/* Catálogo e inmuebles */}
      <section className="py-4 color4 px-8">
        <div className="text-xl font-semibold text-[#14213d]/80">
          Alojamientos dentro de la zona del mapa
        </div>
        <div className="flex gap-8 items-start pt-2 cursor-pointer">
          {/* Cards */}
          <div className="flex-1 grid grid-cols-2 gap-4">
            {loading ? (
              <p className="col-span-4 text-center py-10">Cargando...</p>
            ) : properties.length === 0 ? (
              <p className="col-span-4 text-center py-10">Sin resultados</p>
            ) : (
              properties.map((property: any) => (
                <div
                  className="shadow h-[310px] border border-black/10 color5 rounded-2xl overflow-hidden relative"
                  key={property.id}
                  onMouseEnter={() => setHoveredId(property.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <img
                    className="brightness-75 shadow object-cover h-[190px] w-full transition-all"
                    src={
                      property.images?.[getImageIndex(property.id)] ||
                      property.image
                    }
                    alt=""
                  />
                  <div className="absolute bottom-[125px] w-full flex justify-center gap-1">
                    {property.images?.slice(0, 7).map((_: any, i: number) => (
                      <div
                        key={i}
                        className={`rounded-full transition-all ${
                          i === Math.min(getImageIndex(property.id), 6)
                            ? "bg-white w-2 h-2"
                            : "bg-white/50 w-1.5 h-1.5"
                        }`}
                      />
                    ))}
                  </div>
                  <button
                    className="absolute left-0.5 top-20 cursor-pointer"
                    onClick={(e) =>
                      prevImage(e, property.id, property.images?.length || 1)
                    }
                  >
                    <ChevronLeft size={22} className="m-1.5 pr-0.5" />
                  </button>
                  <button
                    className="absolute right-0.5 top-20 flex justify-end cursor-pointer"
                    onClick={(e) =>
                      nextImage(e, property.id, property.images?.length || 1)
                    }
                  >
                    <ChevronRight size={22} className="m-1.5 pr-0.5" />
                  </button>
                  <div className="text-white absolute bg-[#fca311]/80 mx-3 rounded-md px-3 py-1 top-4 text-xs">
                    Destacada
                  </div>
                  <Link href={`/Inmuebles/Rooms/${property.id}`}>
                    <div className="text-white absolute bg-[#14213d]/80 top-39 right-3 px-3 py-1 text-xs rounded-md">
                      Ver más
                    </div>
                  </Link>
                  <button
                    className="rounded-full p-1.5 color4 absolute top-3 right-3 border-white cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorito(property.id);
                    }}
                  >
                    <Heart
                      size={18}
                      className={
                        favoritos.has(property.id)
                          ? "fill-red-500 text-red-500"
                          : "text-gray-400"
                      }
                    />
                  </button>
                  <p className="text-white font-semibold text-lg absolute top-35 left-3">
                    ${property.price?.toLocaleString()}
                    <span className="text-xs">MXN</span>
                  </p>
                  <p className="text-white font-semibold text-xs absolute top-42 left-3">
                    {property.type} en <span>{property.service}</span>
                  </p>
                  <p className="text-black flex gap-1.5 mx-3 my-4 text-xs">
                    <MapPin className="text-[#fca311]" size={16} />
                    <span
                      className="line-clamp-1 text-[#14213d]"
                      title={property.location}
                    >
                      {property.location}
                    </span>
                  </p>
                  <div className="grid grid-cols-4 mx-3 gap-1.5 px-5 text-[#14213d] text-xs">
                    <div className="flex gap-1 items-center">
                      <BedDouble size={20} />
                      {property.bedrooms}
                    </div>
                    <div className="flex gap-1 items-center">
                      <Bath size={20} />
                      {property.bathrooms}
                    </div>
                    <div className="flex gap-1 items-center">
                      <Ruler size={20} />
                      {property.construction_size
                        ? `${property.construction_size} m²`
                        : property.lot_size
                          ? `${property.lot_size} m²`
                          : "N/A"}
                    </div>
                    <div className="flex gap-1 items-center">
                      <CarFront size={20} />
                      {property.parking}
                    </div>
                  </div>
                  <div className="px-3 pt-3 text-sm text-white">
                    <button className="color3 rounded-lg py-1 w-full px-3 flex items-center justify-center gap-1 cursor-pointer">
                      <MessageCircleMore size={15} />
                      Contactar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Mapa */}
          <div className="w-[38%] h-[500px] sticky top-28 rounded-xl overflow-hidden">
            <MapaProperties properties={properties} hoveredId={hoveredId} />
          </div>
        </div>

        {/* Paginación */}
        {pagination && (
          <div className="flex justify-center items-center gap-2 pb-10 pt-6">
            <button
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
              }
              disabled={filters.page === 1}
              className="w-10 h-10 rounded-xl border border-black/20 flex items-center justify-center text-[#14213d] disabled:opacity-30 hover:border-[#14213d] transition-all cursor-pointer"
            >
              ❮
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
              .filter(
                (p) =>
                  p === 1 ||
                  p === pagination.totalPages ||
                  Math.abs(p - filters.page) <= 2,
              )
              .reduce((acc: (number | string)[], p, i, arr) => {
                if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push("...");
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={`dots-${i}`} className="px-1 text-gray-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={p}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, page: p as number }))
                    }
                    className={`w-10 h-10 rounded-xl border text-sm font-medium transition-all cursor-pointer
                    ${
                      filters.page === p
                        ? "border-[#fca311] text-[#fca311]"
                        : "border-black/20 text-[#14213d] hover:border-[#14213d]"
                    }`}
                  >
                    {p}
                  </button>
                ),
              )}

            <button
              onClick={() =>
                setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
              }
              disabled={filters.page === pagination.totalPages}
              className="w-10 h-10 rounded-xl border border-black/20 flex items-center justify-center text-[#14213d] disabled:opacity-30 hover:border-[#14213d] transition-all cursor-pointer"
            >
              ❯
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
