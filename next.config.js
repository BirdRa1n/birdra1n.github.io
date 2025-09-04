/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // Apenas aplica o rewrite em produção
    if (process.env.NODE_ENV === 'production') {
      return [
        {
          source: '/api/:path*',
          // Usa a variável de ambiente para a URL de destino
          destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
        },
      ];
    }

    // Retorna um array vazio ou null se não for produção
    return [];
  },
};

module.exports = nextConfig;