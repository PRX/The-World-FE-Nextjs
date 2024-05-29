/**
 * @file next.config.js
 * Next.js configuration for this project.
 */

const path = require('path');
const { withPlausibleProxy } = require('next-plausible');
const { uid } = require('uid');

module.exports = withPlausibleProxy({
  subdirectory: uid(6),
  scriptName: uid()
})({
  env: {
    APP_DOMAIN: process.env.APP_DOMAIN,
    API_URL_BASE: process.env.API_URL_BASE,
    WP_REST_ENDPOINT: process.env.WP_REST_ENDPOINT,
    WP_GRAPHQL_ENDPOINT: process.env.WP_GRAPHQL_ENDPOINT,
    CM_API_KEY: process.env.CM_API_KEY,
    CM_API_KEY_28C2ADD24B84C68A: process.env.CM_API_KEY_28C2ADD24B84C68A,
    FB_ACCESS_TOKEN: process.env.FB_ACCESS_TOKEN,
    FB_ADMINS: process.env.FB_ADMINS,
    FB_APP_ID: process.env.FB_APP_ID,
    TWITTER_ACCOUNT_ID: process.env.TWITTER_ACCOUNT_ID
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      }
    ],
    deviceSizes: [370, 600, 960, 1280, 1920],
    imageSizes: [50, 86, 100, 172, 300, 400, 568, 808]
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')]
  },
  async redirects() {
    return [
      {
        source: '/file/:slug*',
        destination: '/media/:slug*',
        permanent: true
      },
      {
        source: '/node/:nid/embedded',
        destination: '/embed/audio/:nid',
        permanent: true
      }
    ];
  },
  webpack(config, { isServer }) {
    const newConfig = {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          '@components': path.join(__dirname, 'components'),
          '@contexts': path.join(__dirname, 'contexts'),
          '@interfaces': path.join(__dirname, 'interfaces'),
          '@lib': path.join(__dirname, 'lib'),
          '@store': path.join(__dirname, 'store'),
          '@svg': path.join(__dirname, 'assets', 'svg'),
          '@theme': path.join(__dirname, 'theme')
        }
      }
    };

    newConfig.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack']
    });

    if (!isServer) {
      newConfig.optimization.splitChunks.cacheGroups = {
        ...newConfig.optimization.splitChunks.cacheGroups,
        // reactCommon: {
        //   chunks: 'all',
        //   test: /(?<!node_modules.*)[\\/]node_modules[\\/]react-(cookies|copy-to-clipboard|html-parser|markdown|moment|player|redux)[\\/]/,
        //   name: (module, chunks, cacheGroupKey) => {
        //     const moduleFileName = module
        //       .identifier()
        //       .split('/')
        //       .reduceRight((item) => item.toLowerCase());
        //     const allChunksNames = chunks
        //       .map((item) => (item.name || '').toLowerCase())
        //       .join('~');
        //     return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
        //   },
        //   priority: 30,
        //   reuseExistingChunk: true,
        //   enforce: true
        // },
        moment: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/]moment(-[^\\/]+)?[\\/]/,
          name: 'moment',
          priority: 30,
          reuseExistingChunk: true,
          enforce: true
        },
        materialui: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/]@material-ui[\\/]/,
          name: 'material-ui',
          priority: 30,
          reuseExistingChunk: true,
          enforce: true
        },
        framermotion: {
          chunks: 'all',
          test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
          name: 'framer-motion',
          priority: 30,
          reuseExistingChunk: true,
          enforce: true
        },
        pages: {
          chunks: 'all',
          test: /[\\/]components[\\/]pages[\\/]/,
          name: (module, chunks, cacheGroupKey) => {
            const moduleFileName = module
              .identifier()
              .split('/')
              .reduceRight((item) => item.toLowerCase());
            const allChunksNames = chunks
              .map((item) => (item.name || '').toLowerCase())
              .join('~');
            return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
          },
          priority: 40,
          reuseExistingChunk: true,
          enforce: true
        },
        audioPlayer: {
          chunks: 'all',
          test: /[\\/]components[\\/]Audio[\\/]/,
          name: 'material-ui',
          priority: 40,
          reuseExistingChunk: true,
          enforce: true
        },
        sidebar: {
          chunks: 'all',
          test: /[\\/]components[\\/]sidebar[\\/]/,
          name: (module, chunks, cacheGroupKey) => {
            const moduleFileName = module
              .identifier()
              .split('/')
              .reduceRight((item) => item.toLowerCase());
            const allChunksNames = chunks
              .map((item) => (item.name || '').toLowerCase())
              .join('~');
            return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
          },
          priority: 40,
          reuseExistingChunk: true,
          enforce: true
        }
        // lib: {
        //   chunks: 'all',
        //   test: /[\\/]lib[\\/]/,
        //   name: (module, chunks, cacheGroupKey) => {
        //     const moduleFileName = module
        //       .identifier()
        //       .split('/')
        //       .reduceRight((item) => item.toLowerCase());
        //     const allChunksNames = chunks
        //       .map((item) => (item.name || '').toLowerCase())
        //       .join('~');
        //     return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
        //   },
        //   priority: 40,
        //   reuseExistingChunk: true,
        //   enforce: true
        // },
        // store: {
        //   chunks: 'all',
        //   test: /[\\/]store[\\/]/,
        //   name: (module, chunks, cacheGroupKey) => {
        //     const moduleFileName = module
        //       .identifier()
        //       .split('/')
        //       .reduceRight((item) => item.toLowerCase());
        //     const allChunksNames = chunks
        //       .map((item) => (item.name || '').toLowerCase())
        //       .join('~');
        //     return `${cacheGroupKey}-${allChunksNames}-${moduleFileName}`;
        //   },
        //   priority: 40,
        //   reuseExistingChunk: true,
        //   enforce: true
        // }
      };
    }

    return newConfig;
  }
});
