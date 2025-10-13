/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  images: {
    domains: [
      'sairon-cdn.storage.c2.liara.space',
      'placehold.co',
      'localhost'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'sairon-cdn.storage.c2.liara.space',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: false,
  },
  
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://saironstore.liara.run'}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;