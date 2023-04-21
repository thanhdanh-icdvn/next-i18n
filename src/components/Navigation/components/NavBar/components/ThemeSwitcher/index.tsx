import { useState, useEffect, ReactElement } from 'react'
import styled from 'styled-components'

import NavBarButton from '../../components/NavBarButton'

import { useTheme } from 'next-themes'
import { useLocale } from '@i18n/context'

import { Icon } from '@components/Content'
import { Sun, Moon } from '@styled-icons/fa-solid'

const ThemeSwitcherButton = styled(NavBarButton)`
  margin-right: ${({ theme }) => theme.sizes.xs};
`

const ThemeSwitcher = (): ReactElement | null => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const { t } = useLocale()

  const toggleTheme = (): void => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
  }

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <ThemeSwitcherButton
      onClick={toggleTheme}
      ariaLabel={t('common.navigation.theme')}
    >
      <Icon as={theme === 'light' ? Sun : Moon} size="xs" wrapper="sm" />
    </ThemeSwitcherButton>
  )
}

export default ThemeSwitcher
