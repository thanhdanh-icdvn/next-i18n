import type { ReactElement } from 'react'
import { useRouter } from 'next/router'

import { useLocale } from '@i18n/context'
import { LOCALES } from '@i18n/constants'

import { LanguageSelectorButton, LanguageSelectorLabel } from './styles'

const LanguageSelector = (): ReactElement => {
  const { t, lang } = useLocale()
  const router = useRouter()

  const toggleLanguage = (): void => {
    const currIndex = LOCALES.findIndex((lgg) => lgg === lang)
    const next = currIndex < LOCALES.length - 1 ? LOCALES[currIndex + 1] : LOCALES[0]

    const localRgx = new RegExp(`^/(${LOCALES.join('|')})`)
    router.push(router.pathname, router.asPath.replace(localRgx, `/${next}`))
  }

  return (
    <LanguageSelectorButton
      onClick={toggleLanguage}
      ariaLabel={t('common.navigation.language')}
    >
      <LanguageSelectorLabel variant="body2" component="strong">
        {lang}
      </LanguageSelectorLabel>
    </LanguageSelectorButton>
  )
}

export default LanguageSelector
