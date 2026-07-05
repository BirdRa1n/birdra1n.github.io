/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: [
    "@uiw/react-md-editor",
    "@uiw/react-markdown-preview",
  ],
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
