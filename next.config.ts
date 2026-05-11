import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Habilitar output standalone para Docker
  output: "standalone",

  // Configuración de imágenes externas (si se usan avatars)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  async rewrites() {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      throw new Error("NEXT_PUBLIC_API_URL is not set");
    }
    return [
      {
        source: "/v1/:path*",
        destination: `${apiUrl}/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;
