import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Espelha o rewrite /api/* da Vercel para o desenvolvimento local.
  // Em produção o rewrite de nível superior captura /api antes,
  // então esta regra nunca dispara por lá.
  async rewrites() {
    const apiTarget =
      process.env["API_INTERNAL_URL"] ?? "http://localhost:3001";

    return [{ source: "/api/:path*", destination: `${apiTarget}/:path*` }];
  },
};

export default nextConfig;
