import type { ReactElement } from 'react'

import { useLocale } from '@i18n/context'

import ThemeSwitcher from './components/ThemeSwitcher'
import LanguageSelector from './components/LanguageSelector'
import NavMenuIcon from '../NavMenuIcon'

import { NavBarBase, NavBarBrand } from './styles'

interface NavBarProps {
  onClick: () => void
  isActive?: boolean
}

/* eslint-disable @next/next/no-img-element */
const NavBar = ({ onClick, isActive = false }: NavBarProps): ReactElement => {
  const { lang } = useLocale()

  return (
    <NavBarBase>
      <NavBarBrand href={`/${lang}`}>
        <img
          src="/portrait.jpg"
          width="34"
          height="34"
          alt={process.env.NEXT_PUBLIC_SITE_TITLE}
        />
      </NavBarBrand>

      <LanguageSelector />

      <ThemeSwitcher />

      <NavMenuIcon isActive={isActive} onClick={onClick} />
    </NavBarBase>
  )
}

export default NavBar
