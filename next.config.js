/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even with ESLint errors
    ignoreDuringBuilds: false
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even with type errors
    ignoreBuildErrors: false
  },
  images: {
    domains: [
      'media.giphy.com',
      // add other allowed domains here if needed
    ],
  },
};

module.exports = nextConfig; 