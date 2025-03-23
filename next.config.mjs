/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['rukmini1.flixcart.com'],
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'merge-deep', 'clone-deep'];

    // Ignore source map files for `chrome-aws-lambda`
    config.module.rules.push({
      test: /\.js\.map$/,
      use: 'null-loader',
    });

    return config;
  },
};

export default nextConfig;
