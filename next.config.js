/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even with ESLint errors
    ignoreDuringBuilds: false
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even with type errors
    ignoreBuildErrors: false
  }
};

module.exports = nextConfig; 