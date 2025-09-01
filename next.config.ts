// next.config.ts
import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // GitHub Pages için static export
 
  trailingSlash: true,
  distDir: 'dist',
  
  // Repo subdirectory için basePath - sadece production'da
  basePath: isProd ? '/shop-ease-frontend' : '',
  assetPrefix: isProd ? '/shop-ease-frontend/' : '',
  
  experimental: { 
    optimizePackageImports: ["@heroicons/react", "lucide-react"],
  },
  images: {
    unoptimized: true, // GitHub Pages için gerekli
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
  },
  compress: true,
  poweredByHeader: false,
};

export default nextConfig;