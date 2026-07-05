/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  transpilePackages: [
    "@uiw/react-md-editor",
    "@uiw/react-markdown-preview",
  ],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Impede o site de ser embutido em iframes (clickjacking)
          { key: "X-Frame-Options", value: "DENY" },
          // Impede o browser de adivinhar MIME types
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Não vaza URL completa para outros domínios
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // Desabilita APIs sensíveis que o site não usa
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          // Força HTTPS (2 anos, incluindo subdomínios)
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
        ],
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
