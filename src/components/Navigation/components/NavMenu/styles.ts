import styled from 'styled-components'

import Link from '@components/Link'
import type { NavMenuProps } from '../NavMenu'

export const NavMenuBase = styled.div<NavMenuProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transition: opacity 300ms ease-in;
`

export const NavMenuItem = styled(Link)<{ isActive: boolean }>`
  display: block;
  text-decoration: none;
  border-bottom: 1px solid;
  border-color: ${({ theme, isActive }) =>
    isActive ? theme.colors.body : 'transparent'};
  color: ${({ theme }) => theme.colors.body};
  transition: color 300ms;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  &:not(:first-child) {
    margin-top: ${({ theme }) => theme.sizes.lg};
  }
`
