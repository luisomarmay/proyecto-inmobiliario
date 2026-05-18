"use client";

import { useState } from "react";
export default function Home() {
  const [activeTab, setActiveTab] = useState("Remate");
  return (
    <div>
      {/* Hero */}
      <div
        className="hero min-h-[60vh]"
        style={{
          backgroundImage:
            "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
        }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content text-neutral-content text-center p-0">
          <div className="max-w-4xl w-full">
            <h1 className="mb-5 text-5xl font-bold">Encuentra tu nuevo hogar</h1>
            <p className="mb-5">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            {/* Buscadores primera fila */}
            <div className="tabs tabs-box bg-white">
              <button
                onClick={() => setActiveTab("Rentar")}
                className={`tab rounded-xl ${
                  activeTab === "Rentar"
                    ? "bg-cyan-700 text-white"
                    : "text-gray-600"
                }`}
              >
                Rentar
              </button>

              <button
                onClick={() => setActiveTab("Comprar")}
                className={`tab rounded-xl ${
                  activeTab === "Comprar"
                    ? "bg-cyan-700 text-white"
                    : "text-gray-600"
                }`}
              >
                Comprar
              </button>

              <button
                onClick={() => setActiveTab("Remate")}
                className={`tab rounded-xl ${
                  activeTab === "Remate"
                    ? "bg-cyan-700 text-white"
                    : "text-gray-600"
                }`}
              >
                Remate
              </button>

              <button
                onClick={() => setActiveTab("Infonavit")}
                className={`tab rounded-xl ${
                  activeTab === "Infonavit"
                    ? "bg-cyan-700 text-white"
                    : "text-gray-600"
                }`}
              >
                Infonavit
              </button>
            </div>
            {/* Buscadores primera fila */}

            {/* Buscadores segunda fila */}
            <div className="flex gap-4 justify-center w-full">
              {/* Buscador por Categoria */}
              <div className="flex items-center gap-3 border border-base-300 p-2 rounded-xl w-1/2 color3 ">
                <input
                  type="text"
                  className="input-neutral w-full"
                  placeholder="Categorias"
                  list="Categorias"
                />

                <datalist id="Categorias">
                  <option value="Chrome"></option>
                  <option value="Firefox"></option>
                  <option value="Safari"></option>
                  <option value="Opera"></option>
                  <option value="Edge"></option>
                </datalist>
              </div>
              {/* Buscador por Categoria */}

              {/* Buscador por estado */}
              <div className="flex items-center gap-4 border border-base-300 p-2 rounded-xl w-1/2 color3 ">
                <input
                  type="text"
                  className="input-neutral w-full"
                  placeholder="¿Dónde quieres buscar?"
                />

                <button className="btn rounded-xl color2 ">Buscar</button>
              </div>
              {/* Buscador por estado */}
            </div>
            {/* Buscadores segunda fila */}

          </div>
        </div>
      </div>
      {/*Hero */}
    </div>
  );
}
