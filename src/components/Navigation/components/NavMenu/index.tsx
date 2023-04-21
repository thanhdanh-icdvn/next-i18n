import type { ReactElement } from 'react'

import { useRouter } from 'next/router'
import { useLocale } from '@i18n/context'

import { Text } from '@components/Content'

import { NavMenuBase, NavMenuItem } from './styles'

export interface NavMenuProps {
  isVisible?: boolean
}

const NavMenu = ({ isVisible = false }: NavMenuProps): ReactElement => {
  const { route } = useRouter()
  const { t, lang } = useLocale()

  return (
    <NavMenuBase isVisible={isVisible}>
      <NavMenuItem href={`/${lang}`} isActive={route === '/[lang]'}>
        <Text variant="title2" component="span" color="inherit">
          {t('common.navigation.home')}
        </Text>
      </NavMenuItem>

      <NavMenuItem
        href={`/${lang}/blog`}
        isActive={route.startsWith('/[lang]/blog')}
      >
        <Text variant="title2" component="span" color="inherit">
          {t('common.navigation.blog')}
        </Text>
      </NavMenuItem>

      <NavMenuItem
        href={`/${lang}/projects`}
        isActive={route.startsWith('/[lang]/projects')}
      >
        <Text variant="title2" component="span" color="inherit">
          {t('common.navigation.projects')}
        </Text>
      </NavMenuItem>
    </NavMenuBase>
  )
}

export default NavMenu
