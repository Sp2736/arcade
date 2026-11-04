import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  // Only apply basePath in production (GitHub Pages deployment)
  // In local development (npm run dev), basePath is empty so images and routes load from root
  basePath: isProd ? "/arcade" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
