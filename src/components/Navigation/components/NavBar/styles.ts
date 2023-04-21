import styled from 'styled-components'

import Link from '@components/Link'

export const NavBarBase = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: ${({ theme }) => theme.sizes.xs};
`

export const NavBarBrand = styled(Link)`
  display: block;
  position: relative;
  text-decoration: none;
  width: ${({ theme }) => theme.sizes.md};
  height: ${({ theme }) => theme.sizes.md};
  margin-right: auto;
  border-radius: 50%;
  border: 1px solid;
  border-color: ${({ theme }) => theme.colors.border};
  overflow: hidden;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${({ theme }) => theme.colors.primary};
    mix-blend-mode: hard-light;
    opacity: 0;
  }

  &:hover {
    &:before {
      opacity: 1;
    }
  }
`
