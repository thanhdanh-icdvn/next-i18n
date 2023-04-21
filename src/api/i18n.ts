import fs from 'fs'
import { join } from 'path'

export interface I18n {
  [key: string]: I18n | string
}

export const getI18n = (lang: string, namespace: string): I18n => {
  const i18nDirectory = join(process.cwd(), 'src/data/i18n')
  const i18nFiles = fs.readdirSync(i18nDirectory)
  const i18nSlug = `${namespace}.${lang}.json`
  const i18nPath = join(i18nDirectory, i18nSlug)

  let i18nContent: I18n = {}

  if (i18nFiles.includes(i18nSlug)) {
    i18nContent = { [namespace]: JSON.parse(fs.readFileSync(i18nPath, 'utf8'))[0] }
  }

  return i18nContent
}
