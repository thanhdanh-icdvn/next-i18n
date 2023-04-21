import type { ReactElement, PropsWithChildren } from 'react'

import { Link as LinkIcon } from '@styled-icons/fa-solid'

import { useLocale } from '@i18n/context'

import { Icon } from '@components/Content'

import {
  SectionBase,
  SectionHeader,
  SectionHeading,
  SectionSeeMore,
  SectionTitle,
  SectionSubtitle,
  SectionContent,
} from './styles'

interface SectionProps {
  title: string
  href: string
  description?: string
}

const Section = ({
  title,
  href,
  description,
  children,
}: PropsWithChildren<SectionProps>): ReactElement => {
  const { t } = useLocale()

  return (
    <SectionBase>
      <SectionHeader>
        <SectionHeading variant="title3" component="h2" color="primary">
          <SectionTitle href={href} title={t('common.see_more')}>
            {title}
          </SectionTitle>

          <SectionSeeMore href={href} title={t('common.see_more')}>
            <Icon as={LinkIcon} size="xs" wrapper="sm" />
          </SectionSeeMore>
        </SectionHeading>

        {description && (
          <SectionSubtitle variant="body1" color="muted">
            {description}
          </SectionSubtitle>
        )}
      </SectionHeader>

      <SectionContent>{children}</SectionContent>
    </SectionBase>
  )
}

export default Section
