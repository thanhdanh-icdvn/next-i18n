import { formatDistanceToNow, format } from 'date-fns'
import { fr, enGB as en } from 'date-fns/locale'

import type { Locale } from '@typings/i18n'

const locales = { fr, en }

export const timeAgo = (
  d: string,
  lang: Locale,
  options: Record<'prefix', string> = { prefix: '' }
): string => {
  let res = options.prefix
  res += formatDistanceToNow(new Date(d), { addSuffix: true, locale: locales[lang] })

  return res
}

export const localeDate = (d: string, lang: Locale): string =>
  format(new Date(d), 'PP', { locale: locales[lang] })

export const readingTime = (markdown: string): string => {
  const mdRegexp =
    /#{1,6}|-{1,3}|`{1,3}|\*|_{1,2}(?=[A-Za-z])|:(\w+):|\(http(.+)\)|\n|\r|\s{2,}/g

  const words = markdown.replace(mdRegexp, '').split(' ').length
  const ttr = Math.round(words / 200)

  return ttr > 0 ? `~${ttr} min` : '~1 min'
}
