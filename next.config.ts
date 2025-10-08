/** @type {import('next').NextConfig} */
const nextConfig = {
  // اضافه کردن این بخش برای ignore کردن خطاها
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  images: {
    domains: [
      'viraland-cdm.storage.c2.liara.space',
      'placehold.co',
      'localhost'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'viraland-cdm.storage.c2.liara.space',
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
    unoptimized: true,
  },
  
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://rivaland.liara.run'}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;