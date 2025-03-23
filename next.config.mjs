/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@sparticuz/chromium-min', 'puppeteer-core'],
  },
  env: {
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: 'true',
  },
  images: {
    domains: ['rukmini1.flixcart.com'], // Add allowed image domains
  },
  webpack: (config) => {
    config.externals = [
      ...(config.externals || []), 
      'merge-deep', 
      'clone-deep',
      'yargs',  // Fix for "Critical dependency" warnings
      'yargs-parser'
    ];

    return config;
  },
};

export default nextConfig;
