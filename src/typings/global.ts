import type { ParsedUrlQuery } from 'querystring'

import type { Locale } from './i18n'

export interface QParams extends ParsedUrlQuery {
  slug?: string
  lang?: Locale
}
