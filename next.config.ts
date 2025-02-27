import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname:"localhost",
        pathname: '/**',
      },
      {
        protocol:"https",
        hostname:"placehold.co",
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
