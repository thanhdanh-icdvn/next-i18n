import type { ReactElement } from 'react'

import { Twitter, Gitlab, Github } from '@styled-icons/fa-brands'
import { Rss } from '@styled-icons/fa-solid'

import { useLocale } from '@i18n/context'

import { Icon } from '@components/Content'

import { NavFooterBase, NavFooterSocialLink } from './styles'

const NavFooter = (): ReactElement => {
  const { lang } = useLocale()

  return (
    <NavFooterBase>
      {process.env.NEXT_PUBLIC_TWITTER_USERNAME && (
        <NavFooterSocialLink
          href={`https://twitter.com/${process.env.NEXT_PUBLIC_TWITTER_USERNAME}`}
          ariaLabel="Twitter"
        >
          <Icon as={Twitter} size="xs" wrapper="sm" />
        </NavFooterSocialLink>
      )}

      {process.env.NEXT_PUBLIC_GITLAB_USERNAME && (
        <NavFooterSocialLink
          href={`https://gitlab.com/${process.env.NEXT_PUBLIC_GITLAB_USERNAME}`}
          ariaLabel="Gitlab"
        >
          <Icon as={Gitlab} size="xs" wrapper="sm" />
        </NavFooterSocialLink>
      )}

      {process.env.NEXT_PUBLIC_GITHUB_USERNAME && (
        <NavFooterSocialLink
          href={`https://github.com/${process.env.NEXT_PUBLIC_GITHUB_USERNAME}`}
          ariaLabel="Github"
        >
          <Icon as={Github} size="xs" wrapper="sm" />
        </NavFooterSocialLink>
      )}

      <NavFooterSocialLink href={`/${lang}/feed.xml`} ariaLabel="RSS" isExternal>
        <Icon as={Rss} size="xs" wrapper="sm" />
      </NavFooterSocialLink>
    </NavFooterBase>
  )
}

export default NavFooter
