/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    domains: ["https://nine-tails-shinobi-shop.vercel.app/", "https://shopify-production-6529.up.railway.app/"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
