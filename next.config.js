/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [{
      source: '/(.*)',
      headers: [
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff'
        }
      ]
    }]
  },
  eslint: {
    ignoreDuringBuilds: true
  }
}

module.exports = nextConfig
