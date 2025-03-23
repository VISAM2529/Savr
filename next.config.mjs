/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@sparticuz/chromium-min', 'puppeteer-core']
  },
  env: {
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: 'true',
  },
  images: {
    domains: ['rukmini1.flixcart.com'], // Add the hostname here
  },

    webpack: (config) => {
      config.externals = [...(config.externals || []), 'merge-deep', 'clone-deep'];
  
      return config;
    },
  };
  
  export default nextConfig;
  
