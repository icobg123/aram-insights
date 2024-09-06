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
};

module.exports = nextConfig;
