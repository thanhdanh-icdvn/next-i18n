import type { Locale } from '@typings/i18n'
import { LOCALES, DEFAULT_LOCALE } from './constants'

export const isLocale = (str: string): str is Locale =>
  LOCALES.includes(str as Locale)

export const getInitialLocale = (): Locale => {
  const [browserSetting] = navigator.language.split('-')

  return isLocale(browserSetting) ? browserSetting : DEFAULT_LOCALE
}
