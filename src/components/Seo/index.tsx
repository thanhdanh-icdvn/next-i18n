import type { ReactElement } from 'react'

import Head from 'next/head'

import { useLocale } from '@i18n/context'

interface SeoProps {
  title?: string
  pathname?: string
  description?: string
}

const Seo = ({ title, description, pathname }: SeoProps): ReactElement => {
  const { t, lang } = useLocale()

  return (
    <Head>
      <title key="title">
        {title
          ? `${title} | ${process.env.NEXT_PUBLIC_SITE_NAME}`
          : `${process.env.NEXT_PUBLIC_SITE_NAME}`}
      </title>

      <meta
        name="description"
        content={description || t(`common.description`)}
        key="description"
      />

      {/* Favicon */}
      <link rel="shortcut icon" href="/favicon.png" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta
        property="og:title"
        content={
          title
            ? `${title} | ${process.env.NEXT_PUBLIC_SITE_NAME}`
            : `${process.env.NEXT_PUBLIC_SITE_NAME}`
        }
      />
      <meta
        property="og:url"
        content={`${process.env.NEXT_PUBLIC_SITE_URL}/${pathname || ''}`}
      />
      <meta
        property="og:description"
        content={description || t(`common.description`)}
      />
      <meta property="og:site_name" content={process.env.NEXT_PUBLIC_SITE_NAME} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:site"
        content={`@${process.env.NEXT_PUBLIC_TWITTER_USERNAME}`}
      />
      <meta
        name="twitter:creator"
        content={`@${process.env.NEXT_PUBLIC_TWITTER_USERNAME}`}
      />

      {/* RSS */}
      <link
        rel="alternate"
        type="application/rss+xml"
        title={`${t('common.rss')} ${process.env.NEXT_PUBLIC_SITE_NAME}`}
        href={`/${lang}/feed.xml`}
      />

      {/* Robots & indexing */}
      <meta key="robots" name="robots" content="index,follow" />

      <link
        rel="canonical"
        href={`${process.env.NEXT_PUBLIC_SITE_URL}/${pathname || ''}`}
      />
    </Head>
  )
}

export default Seo
