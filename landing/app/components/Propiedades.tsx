const propiedades = [
        { id: 1, titulo: "Casa en Mérida", precio: "$2,500,000", tipo: "Venta", ubicacion: "Mérida, Yucatán" },
        { id: 2, titulo: "Depto en Montejo", precio: "$1,800,000", tipo: "Renta", ubicacion: "Mérida, Yucatán" },
        { id: 3, titulo: "Local en Centro", precio: "$950,000", tipo: "Venta", ubicacion: "Izamal, Yucatán" },
]

export default function Propiedades() {
    return (
        <section className="bg-nieve py-16 px-10">
            <h2 className="text-3xl font-playfair font-bold text-prusia text-center mb-10" >
                Propiedades destacadas
            </h2>
            <div className="grid grid-cols-3 gap-8">
                {propiedades.map((propiedad) => (
                    <div key={propiedad.id} className="bg-white rounded-xl shadow-md p-6">
                        <div className="bg-prusia h-40 rounded-lg mb-4"></div>
                        <h3 className="text-xl font-inter font-bold text-oscuro">{propiedad.titulo}</h3>
                        <p className="text-naranja font-semibold">{propiedad.precio}</p>
                        <p className="text-gray-500 text-sm">{propiedad.ubicacion}</p>
                        <span className="text-xs bg-naranja text-white px-3 py-1 rounded-full">
                            {propiedad.tipo}
                        </span>
                    </div>
                )
                )}
            </div>
        </section>
    )
}