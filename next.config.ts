import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/arcade',
  images: {
    unoptimized: true, // Required for static exports
  },
};

export default nextConfig;