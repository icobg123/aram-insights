/** @type {import('next').NextConfig} */
const nextConfig = {
  staticPageGenerationTimeout: 500,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ddragon.leagueoflegends.com",
      },
    ],
  },
  // Performance optimizations
  experimental: {
    optimizePackageImports: [
      "react-icons",
      "@tanstack/react-table",
      "react-use",
    ],
    // Mark sharp and plaiceholder as server-only packages
    serverComponentsExternalPackages: ["sharp", "plaiceholder"],
  },
  // Optimize development performance
  onDemandEntries: {
    // Keep pages in memory longer during development
    maxInactiveAge: 60 * 60 * 1000, // 1 hour
    pagesBufferLength: 5,
  },
};

module.exports = nextConfig;
