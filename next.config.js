const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const isProd = process.env.NODE_ENV === 'production'

module.exports = withBundleAnalyzer({
  assetPrefix: isProd ? '/' : '',
  trailingSlash: true,
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    localeDetection: false,
  },
  webpack: (config, { dev, isServer }) => {
    if (!dev && isServer) {
      const originalEntry = config.entry

      config.entry = async () => {
        const entries = await originalEntry()

        // These scripts can import components from the app and use ES modules
        return { ...entries, 'scripts/rss-generate': './src/scripts/rss.ts' }
      }
    }

    return config
  },
})
