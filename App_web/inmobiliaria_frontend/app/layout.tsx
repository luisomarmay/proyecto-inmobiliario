import "./globals.css";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={playfair.variable}>
      <body>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}