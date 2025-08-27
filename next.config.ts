import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Configuração para Netlify - sem output standalone
  eslint: {
    ignoreDuringBuilds: true, // Ignorar warnings de ESLint durante build
  },
  typescript: {
    ignoreBuildErrors: false, // Manter verificação de TypeScript
  },
  images: {
    unoptimized: true, // Necessário para sites estáticos
  },
};

export default nextConfig;