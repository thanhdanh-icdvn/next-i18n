import styled from 'styled-components'

import Link from '@components/Link'

export const NavFooterBase = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`

export const NavFooterSocialLink = styled(Link)`
  display: block;
  color: ${({ theme }) => theme.colors.body};
  transition: color 300ms;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }

  &:not(:first-child) {
    margin-left: ${({ theme }) => theme.sizes.sm};
  }
`
