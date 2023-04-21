import type { ReactElement } from 'react'
import type { GetStaticProps, GetStaticPaths } from 'next'
import type { QParams } from '@typings/global'

import { Project, getProjects } from '@api/projects'
import { I18n, getI18n } from '@api/i18n'

import { useLocale } from '@i18n/context'
import { LOCALES, DEFAULT_LOCALE } from '@i18n/constants'

import { timeAgo, localeDate } from '@utils/datetime'

import Seo from '@components/Seo'
import { Page, Container, Headline } from '@components/Layout'
import { Card } from '@components/Content'

interface ProjectsProps {
  projects: Project[]
  translations: I18n
}

const Projects = ({ projects, translations }: ProjectsProps): ReactElement => {
  const { t, lang } = useLocale(translations)

  return (
    <Page heading={<Headline>{t('projects.description')}</Headline>}>
      <Seo
        title={t('projects.title.page')}
        description={t('projects.description')}
        pathname={`${lang}/projects`}
      />

      <Container>
        {projects.map((project) => (
          <Card
            key={project.name}
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
      </Container>
    </Page>
  )
}

export default Projects

export const getStaticProps: GetStaticProps<ProjectsProps, QParams> = async ({
  params,
}) => {
  const lang = params?.lang || DEFAULT_LOCALE
  const projects = getProjects(lang)

  const translations = getI18n(lang, 'projects')

  return {
    props: { projects, translations },
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
