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
    const filesApi = process.env.NEXT_PUBLIC_FILES_API_URL || 'http://localhost:8084/api';
    const repoApi = process.env.NEXT_PUBLIC_REPOSITORY_API_URL || '/api/repository';
    const issuesApi = process.env.NEXT_PUBLIC_ISSUES_API_URL || 'http://localhost:8085';
    const orgApi = process.env.NEXT_PUBLIC_ORG_API_URL || 'http://localhost:8083';
    const pullRequestApi = process.env.NEXT_PUBLIC_PR_API_URL || 'http://localhost:8082/api';

    // eslint-disable-next-line no-console
    console.log('[REWRITE CONFIG] repoApi:', repoApi);

    // Ensure no trailing slash
    const normalize = (u: string) => u.endsWith('/') ? u.slice(0, -1) : u;

    // Warn developers when repository API is configured as a relative path.
    // A relative value like '/api/repository' will be rewritten to itself
    // and can cause 404 responses because the proxy points to the same path.
    if (!repoApi.startsWith('http')) {
      // Only warn in development
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.warn(`NEXT_PUBLIC_REPOSITORY_API_URL is set to a relative path ('${repoApi}'). If your backend is running on a different port (e.g. 8090), set NEXT_PUBLIC_REPOSITORY_API_URL to the absolute backend URL (e.g. http://localhost:8090/api) to avoid proxy self-rewrite 404s.`);
      }
    }

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
        source: '/issues/:path*',
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
      {
        source: '/api/pullrequest/:path*',
        destination: `${normalize(pullRequestApi)}/:path*`,
      },
    ];
  },
};

export default nextConfig;
