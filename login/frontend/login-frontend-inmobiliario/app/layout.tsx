import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import './globals.css';

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${playfair.variable} ${dmSans.variable}`}>
        {children}
      </body>
    </html>
  );
}
