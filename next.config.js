/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbopack: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
  },
}

module.exports = nextConfig
