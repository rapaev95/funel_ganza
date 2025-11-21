const createNextIntlPlugin = require('next-intl/plugin')
const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/ru',
        permanent: false,
      },
    ]
  },
}

module.exports = withNextIntl(nextConfig)

