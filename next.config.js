/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
  // Added for React 19 compatibility
  reactStrictMode: true,
  // Experimental features for Next.js 15
  experimental: {
    // Enable optimizations for React 19
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
};

module.exports = nextConfig;
