/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  transpilePackages: [
    "@uiw/react-md-editor",
    "@uiw/react-markdown-preview",
  ],

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [{ key: "x-robots-tag", value: "noindex" }],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: "/dashboard",
        destination: "/admin",
      },
    ];
  },
};

export default nextConfig;
