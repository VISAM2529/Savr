/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['rukmini1.flixcart.com'], // Add the hostname here
  },

    webpack: (config) => {
      config.externals = [...(config.externals || []), 'merge-deep', 'clone-deep'];
  
      return config;
    },
  };
  
  export default nextConfig;
  
