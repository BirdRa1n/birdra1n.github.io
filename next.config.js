/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,

  // Necessário para @uiw/react-md-editor e @uiw/react-markdown-preview
  // importarem CSS de dentro do node_modules sem quebrar o webpack
  transpilePackages: [
    "@uiw/react-md-editor",
    "@uiw/react-markdown-preview",
  ],

  // Ignora erros de TypeScript e ESLint no build de produção
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
