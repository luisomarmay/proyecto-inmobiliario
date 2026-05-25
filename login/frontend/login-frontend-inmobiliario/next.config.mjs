/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ignora errores de ESLint en el build
  },
  typescript: {
    ignoreBuildErrors: true, // ← agregar esto
  },

};

export default nextConfig;
