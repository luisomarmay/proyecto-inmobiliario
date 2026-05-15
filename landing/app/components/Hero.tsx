"use client"
import { motion } from "framer-motion"

export default function Hero() {
    return (
        <section className="bg-prusia min-h-screen flex items-center px-6 gap-10 pt-15 ">
           
           <motion.div 
                initial={{ opacity: 0, x: -80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                className="w-1/2 flex flex-col gap-6">
           <h1 className="text-white font-playfair text-5xl font-bold leading-tight">
                Encuentra la propiedad de tus sueños
            </h1>
            <p className="text-nieve font-inter text-xl ">
                Compra, vende o renta con los mejores asesores de Yucatán
            </p>
            <button className="bg-naranja text-white font-inter text-lg font-semibold px-8 py-3 rounded-full w-fit mx-auto 
            transition-all duration-300 hover:bg-opacity-80 hover:scale-105 cursor-pointer">
                Ver propiedades
            </button>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, x: 80 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
            className="w-1/2">
                <img src="/casa-yucatan.jpg"
                    alt="propiedad destacada"
                    className="rounded-2xl w-full h-[600px] object-cover shadow-2xl"
                 />
            </motion.div>
        </section>
    )

    
}
