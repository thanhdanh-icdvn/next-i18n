import { ReactElement, useState, useEffect } from 'react'

import { useScroll } from '@utils/scroll'

import { NavBar, NavMenu, NavFooter } from './components'

import { NavigationGlobalStyle, NavigationBase, NavigationContainer } from './styles'

const Navigation = (): ReactElement => {
  const [scrollDir] = useScroll()
  const [isSticky, setIsSticky] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) return

    setIsSticky(scrollDir !== 'down')
  }, [scrollDir, isOpen])

  const toggleMenu = (): void => setIsOpen(!isOpen)

  return (
    <NavigationBase isSticky={isSticky} isOpen={isOpen}>
      <NavigationContainer>
        <NavBar isActive={isOpen} onClick={toggleMenu} />

        <NavMenu isVisible={isOpen} />
        <NavFooter />
      </NavigationContainer>

      <NavigationGlobalStyle hasOverlay={isOpen} />
    </NavigationBase>
  )
}

export default Navigation
