import { createContext } from 'react'
import type { Locale } from '@typings/i18n'

interface LocaleCtx {
  locale: Locale | null
  setLocale: (value: Locale) => void
}

const LocaleContext = createContext({} as LocaleCtx)

export default LocaleContext
