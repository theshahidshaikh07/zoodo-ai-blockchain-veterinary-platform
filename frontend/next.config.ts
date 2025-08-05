import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
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
  // Enable webpack 5
  webpack: (config, { isServer }) => {
    // Important: return the modified config
    return config;
  },
};

export default nextConfig;
