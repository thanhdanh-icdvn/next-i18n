import fs from 'fs'
import { join } from 'path'

import { DEFAULT_LOCALE } from '@i18n/constants'

const PROJECTS_DIR = join(process.cwd(), 'src/data/projects')

export interface Project {
  name: string
  description?: string
  url: string
  date: string
}

export const getProject = (
  filename: string,
  lang: string = DEFAULT_LOCALE
): Project | null => {
  const filePath = join(PROJECTS_DIR, filename)
  const [content] = JSON.parse(fs.readFileSync(filePath, 'utf8'))

  if (!content.description[lang]) return null

  return {
    ...content,
    description: content.description[lang],
  }
}

export const getProjects = (lang: string = DEFAULT_LOCALE): Project[] => {
  const files = fs.readdirSync(PROJECTS_DIR)

  // Filter unavailable projects then sort by date (ASC)
  const projects = files
    .map((filename) => getProject(filename, lang))
    .filter((p) => p !== null)
    .sort((p1, p2) =>
      (p1 as Project).date > (p2 as Project).date ? -1 : 1
    ) as Project[]

  return projects
}
