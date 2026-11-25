import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.selenyel.com" }],
        destination: "https://selenyel.com/:path*",
        permanent: true,
      },
      {
        source: "/cv",
        destination: "/",
        permanent: true,
      },
      {
        source: "/cv/:path*",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
