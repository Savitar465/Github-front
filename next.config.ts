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
    const filesApi = process.env.NEXT_PUBLIC_API_URL || '/api/files';
    const repoApi = process.env.NEXT_PUBLIC_REPOSITORY_API_URL || '/api/repository';
    const issuesApi = process.env.NEXT_PUBLIC_ISSUES_API_URL || repoApi;
    const orgApi = process.env.NEXT_PUBLIC_ORG_API_URL || 'http://localhost:8083';

    // Ensure no trailing slash
    const normalize = (u: string) => u.endsWith('/') ? u.slice(0, -1) : u;

    return [
      {
        source: '/api/files/:path*',
        destination: `${normalize(filesApi)}/:path*`,
      },
      {
        source: '/api/repository/:path*',
        destination: `${normalize(repoApi)}/:path*`,
      },
      {
        source: '/api/issues/:path*',
        destination: `${normalize(issuesApi)}/:path*`,
      },
      {
        source: '/v1/orgs/:path*',
        destination: `${normalize(orgApi)}/v1/orgs/:path*`,
      },
      {
        source: '/v1/user/orgs',
        destination: `${normalize(orgApi)}/v1/user/orgs`,
      },
    ];
  },
};

export default nextConfig;
