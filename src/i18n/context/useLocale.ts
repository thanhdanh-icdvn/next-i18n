import { useContext } from 'react'
import type { Locale } from '@typings/i18n'
import type { I18n } from '@api/i18n'

import * as common from '@data/i18n/common'
import LocaleContext from './LocaleContext'

interface LocaleHook {
  t: (key: string) => string
  lang: Locale
  setLang: (value: Locale) => void
}

const useLocale = (translations?: I18n): LocaleHook => {
  const { locale, setLocale } = useContext(LocaleContext)
  const i18nCommon: I18n = locale ? common[locale] : {}
  const i18nScoped: I18n = translations || {}

  const i18nContent: I18n = {
    common: i18nCommon,
    ...i18nScoped,
  }

  const t = (key: string): string => {
    const kArray = key.split('.')

    // Parsing possibly nested object
    let res: I18n | string = i18nContent

    kArray.forEach((k: string) => {
      res = typeof res === 'string' ? res : res[k]
    })

    return typeof res === 'string' ? res : key
  }

  const setLang = (value: Locale): void => setLocale(value)

  return { t, lang: locale as Locale, setLang }
}

export default useLocale
