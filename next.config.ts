// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { optimizePackageImports: ["@heroicons/react", "lucide-react"] },
  images: {
    formats: ["image/webp", "image/avif"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
  },
  compress: true,
  poweredByHeader: false,

  async rewrites() {
    const remoteBase = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "";
    return remoteBase
      ? [{ source: "/api/:path*", destination: `${remoteBase}/api/:path*` }]
      : [];
  },
};

export default nextConfig;