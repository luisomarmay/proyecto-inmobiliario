import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import './globals.css';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import Providers from './Components/Providers';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['600', '700'],
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm',
  weight: ['300', '400', '500'],
});

export const metadata: Metadata = {
  title: 'Sistema Inmobiliario',
  description: 'Plataforma integral de gestión inmobiliaria',
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${playfair.variable} ${dmSans.variable}`}>
      <body>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers> {/* ← usa Providers en lugar de AuthProvider directo */}
      </body>
    </html>
  );
}