import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* mockup: sem auth, sem backend — só telas */
  // Servido em /mockup no deploy multi-service (rewrite da Vercel);
  // o dev local passa a responder em /mockup/* também.
  basePath: "/mockup",
};

export default nextConfig;
