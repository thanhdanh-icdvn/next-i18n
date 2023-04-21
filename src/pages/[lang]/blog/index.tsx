import type { ReactElement } from 'react'
import type { GetStaticProps, GetStaticPaths } from 'next'
import type { QParams } from '@typings/global'

import { Post, getPosts } from '@api/posts'
import { I18n, getI18n } from '@api/i18n'

import { useLocale } from '@i18n/context'
import { LOCALES, DEFAULT_LOCALE } from '@i18n/constants'

import { timeAgo, localeDate } from '@utils/datetime'

import Seo from '@components/Seo'
import { Page, Container, Headline } from '@components/Layout'
import { Card } from '@components/Content'

interface BlogProps {
  posts: Post<'title' | 'excerpt' | 'readingTime'>[]
  translations: I18n
}

const Blog = ({ posts, translations }: BlogProps): ReactElement => {
  const { t, lang } = useLocale(translations)

  return (
    <Page heading={<Headline>{t('blog.description')}</Headline>}>
      <Seo
        title={t('blog.title.page')}
        description={t('blog.description')}
        pathname={`${lang}/blog`}
      />

      <Container>
        {posts.map((post) => (
          <Card
            key={post.slug}
            href={`/${lang}/blog/${post.slug}`}
            title={post.title}
            body={post.excerpt}
            metas={[
              {
                label: timeAgo(post.date, lang, { prefix: t('common.published') }),
                title: localeDate(post.date, lang),
              },
              { label: post.readingTime },
            ]}
          />
        ))}
      </Container>
    </Page>
  )
}

export default Blog

export const getStaticProps: GetStaticProps<BlogProps, QParams> = async ({
  params,
}) => {
  const lang = params?.lang || DEFAULT_LOCALE
  const posts = getPosts(['title', 'excerpt', 'readingTime'], lang)

  const translations = getI18n(lang, 'blog')

  return {
    props: { posts, translations },
  }
}

export const getStaticPaths: GetStaticPaths<QParams> = async () => {
  return {
    paths: LOCALES.map((lang) => ({
      params: { lang },
    })),
    fallback: false,
  }
}
