import type { NextConfig } from "next";

const localRedirectPorts = [3000, 3001];
const canonicalRedirectHosts = [
  "intentional.studio",
  "intentional-studio.vercel.app",
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      ...canonicalRedirectHosts.map((host) => ({
        source: "/:path*",
        has: [{ type: "host" as const, value: host }],
        destination: "https://www.intentional.studio/:path*",
        permanent: true,
      })),
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
