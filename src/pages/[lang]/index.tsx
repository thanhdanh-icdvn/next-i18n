import type { ReactElement } from 'react'
import type { GetStaticProps, GetStaticPaths } from 'next'
import type { QParams } from '@typings/global'

import { Post, getPosts } from '@api/posts'
import { Project, getProjects } from '@api/projects'
import { I18n, getI18n } from '@api/i18n'

import { useLocale } from '@i18n/context'
import { LOCALES, DEFAULT_LOCALE } from '@i18n/constants'

import { timeAgo, localeDate } from '@utils/datetime'

import Seo from '@components/Seo'
import { Text, Card } from '@components/Content'
import { Container, Grid, Page, Section, Headblock } from '@components/Layout'

interface HomeProps {
  posts: Post<'title' | 'excerpt' | 'readingTime'>[]
  projects: Project[]
  translations: I18n
}

const MAX_ITEM = 4

const Home = ({ posts, projects, translations }: HomeProps): ReactElement => {
  const { t, lang } = useLocale(translations)

  return (
    <Page
      heading={
        <Headblock>
          <Text variant="title2" color="primary">
            {t('home.description.title')}
          </Text>
          <Text variant="body1" color="muted">
            {t('home.description.subtitle')}
          </Text>
        </Headblock>
      }
    >
      <Seo pathname={lang} />

      <Container>
        <Section
          title={t('blog.title.section')}
          href={`/${lang}/blog`}
          description={t('blog.description')}
        >
          <Grid columns={2} gutter>
            {posts.slice(0, MAX_ITEM).map((post) => (
              <Card
                key={post.slug}
                variant="compact"
                href={`/${lang}/blog/${post.slug}`}
                title={post.title}
                body={post.excerpt}
                metas={[
                  {
                    label: timeAgo(post.date, lang, {
                      prefix: t('common.published'),
                    }),
                    title: localeDate(post.date, lang),
                  },
                  { label: post.readingTime },
                ]}
              />
            ))}
          </Grid>
        </Section>

        <Section
          title={t('projects.title.section')}
          href={`/${lang}/projects`}
          description={t('projects.description')}
        >
          <Grid columns={2} gutter>
            {projects.slice(0, MAX_ITEM).map((project) => (
              <Card
                key={project.name}
                variant="compact"
                href={project.url}
                title={project.name}
                body={project.description}
                metas={[
                  {
                    label: timeAgo(project.date, lang, {
                      prefix: t('common.updated'),
                    }),
                    title: localeDate(project.date, lang),
                  },
                ]}
              />
            ))}
          </Grid>
        </Section>
      </Container>
    </Page>
  )
}

export default Home

export const getStaticProps: GetStaticProps<HomeProps, QParams> = async ({
  params,
}) => {
  const lang = params?.lang || DEFAULT_LOCALE
  const posts = getPosts(['title', 'excerpt', 'readingTime'], lang)

  const projects = getProjects(lang)

  const translations = {
    ...getI18n(lang, 'home'),
    ...getI18n(lang, 'blog'),
    ...getI18n(lang, 'projects'),
  }

  return {
    props: {
      posts,
      projects,
      translations,
    },
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
