/** @type {import('next').NextConfig} */
import { resolve } from 'path';

const nextConfig = {
  serverExternalPackages: ['playwright-core'],
  experimental: {
    serverComponentsExternalPackages: ['@sparticuz/chromium-min', 'puppeteer-core'],
  },
  env: {
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD: 'true',
  },
  images: {
    domains: ['rukmini1.flixcart.com'], // Add allowed image domains
  },
  webpack(config, { isServer }) {
    // Add support for TypeScript
    config.module.rules.push({
      test: /\.ts$/,
      use: [
        {
          loader: 'ts-loader',
          options: { transpileOnly: true },
        },
      ],
    });

    // Handle .map files (source maps)
    config.module.rules.push({
      test: /\.map$/,
      use: 'raw-loader', // Load source maps as raw files
    });

    // External dependencies (to fix "Critical dependency" warnings)
    config.externals = [
      ...(config.externals || []),
      'merge-deep', 
      'clone-deep',
      'yargs',  // Fix for "Critical dependency" warnings
      'yargs-parser',
    ];

    // Optionally, configure for Chromium and Puppeteer
    if (isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@sparticuz/chromium-min': resolve('node_modules', '@sparticuz/chromium-min'),
      };
    }

    return config;
  },
};

export default nextConfig;
