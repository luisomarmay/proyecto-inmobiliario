import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import Propiedades from "./components/Propiedades"
import PorQueElegirnos from "./components/PorQueElegirnos"
import Footer from "./components/Footer"
import Contacto from "./components/Contacto"

export default function Home() {
  return (
    <main>
      <Navbar/>
      <Hero/>
      <Propiedades/>
      <PorQueElegirnos/>
      <Contacto/>
      <Footer/>
    </main>
  )
}