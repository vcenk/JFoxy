/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Transpile ESM packages for compatibility
  transpilePackages: ['@react-pdf/renderer'],
  webpack: (config) => {
    // Handle canvas package (used by react-pdf but not needed in browser)
    config.resolve.alias.canvas = false
    return config
  },
}

module.exports = nextConfig
