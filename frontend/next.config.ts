import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // Enable React strict mode
  reactStrictMode: true,
  // Output standalone for better compatibility
  output: 'standalone',
};

export default nextConfig;
