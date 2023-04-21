import styled from 'styled-components'

import type { NavBarButtonProps } from '../NavBarButton'

export const NavBarButtonBase = styled.button<NavBarButtonProps>`
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  vertical-align: middle;
  text-align: center;
  -webkit-appearance: none;
  cursor: pointer;
  width: ${({ theme }) => theme.sizes.sm};
  height: ${({ theme }) => theme.sizes.sm};
  padding: 0;
  border: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.body};
  transition: color 300ms;

  &:active,
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  &:focus {
    -webkit-tap-highlight-color: transparent;
    outline: none;
  }
`
