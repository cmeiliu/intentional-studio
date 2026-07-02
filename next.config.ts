import type { NextConfig } from "next";

const localRedirectPorts = [3000, 3001];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "intentional.studio" }],
        destination: "https://www.intentional.studio/:path*",
        permanent: true,
      },
      ...localRedirectPorts.map((port) => ({
        source: "/:path*",
        has: [{ type: "host" as const, value: `intentional.studio:${port}` }],
        destination: `http://www.intentional.studio:${port}/:path*`,
        permanent: true,
      })),
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
