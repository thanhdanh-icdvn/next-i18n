import type { ReactElement } from 'react'
import { CreativeCommons, CreativeCommonsBy } from '@styled-icons/fa-brands'

import { useLocale } from '@i18n/context'

import { Icon } from '@components/Content'
import Link from '@components/Link'

import {
  CreditsBase,
  CreditsContainer,
  CreditsLicenseText,
  CreditsLicenseBadge,
} from './styles'

const Credits = (): ReactElement => {
  const { t, lang } = useLocale()

  return (
    <CreditsBase>
      <CreditsContainer>
        <CreditsLicenseText variant="body2" color="hint">
          {t('common.license')}
          <Link
            href={`https://creativecommons.org/licenses/by/4.0/deed.${lang}`}
            isInline
          >
            Creative Commons Attribution 4.0 International
          </Link>
          .
        </CreditsLicenseText>

        <CreditsLicenseBadge
          href={`https://creativecommons.org/licenses/by/4.0/deed.${lang}`}
          ariaLabel="Creative Commons Attribution 4.0 Badge"
        >
          <Icon as={CreativeCommons} size="xs" wrapper="sm" />
          <Icon as={CreativeCommonsBy} size="xs" wrapper="sm" />
        </CreditsLicenseBadge>
      </CreditsContainer>
    </CreditsBase>
  )
}

export default Credits
