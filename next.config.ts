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

  // ⚡ ریدایرکت www → بدون www
  async redirects() {
    return [
      {
        source: '/:path*', // تمام مسیرها
        has: [
          {
            type: 'host',
            value: 'www.saironstore.ir' // وقتی کاربر www زد
          }
        ],
        destination: 'https://saironstore.ir/:path*', // هدایت به بدون www
        permanent: true, // ریدایرکت 301
      },
    ];
  },

  // ⚡ rewrites برای api بک‌اند
  async rewrites() {
    return [
      {
        source: "/api/:path*", // مسیر درخواست‌های api
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.saironstore.ir'}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
