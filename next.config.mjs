/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  swcMinify: true,
};
import withBundleAnalyzer from "@next/bundle-analyzer";

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
})(nextConfig);
