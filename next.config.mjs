/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
      { protocol: "https", hostname: "api.qrserver.com" },
    ],
  },
  // Allow large video files in /public
  experimental: {},
  // Headers for video streaming (byte-range requests)
  async headers() {
    return [
      {
        source: "/video/:path*",
        headers: [
          { key: "Accept-Ranges", value: "bytes" },
          { key: "Cache-Control",  value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;
