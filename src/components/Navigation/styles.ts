import styled, { createGlobalStyle } from 'styled-components'
import { math } from 'polished'

import Container from '@components/Layout/Container'

export const NavigationGlobalStyle = createGlobalStyle<{ hasOverlay: boolean }>`
  body {
    padding-top: ${({ theme }) => math(`${theme.sizes.md} + ${theme.sizes.xs} * 2`)};
    overflow: ${({ hasOverlay }) => (hasOverlay ? 'hidden' : 'auto')};
  }
`

export const NavigationBase = styled.nav<{ isSticky: boolean; isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: ${({ theme, isOpen }) =>
    isOpen
      ? 0
      : `calc(100% - ${math(`${theme.sizes.md} + ${theme.sizes.xs} * 2`)})`};
  z-index: 100;
  padding-top: ${({ theme }) => theme.sizes.xs};
  padding-bottom: ${({ theme }) => theme.sizes.xs};
  overflow: hidden;
  transform: ${({ isSticky }) => (isSticky ? 'translateY(0)' : 'translateY(-100%)')};
  transition: bottom 450ms ease-out, transform 300ms ease-out;
  backdrop-filter: blur(0.4rem);

  &:after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: -1;
    background-color: ${({ theme }) => theme.colors.paper};
    opacity: 0.875;
  }
`

export const NavigationContainer = styled(Container)`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`
