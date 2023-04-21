import styled from 'styled-components'

import Link from '@components/Link'

export const FootnoteBase = styled.footer`
  margin-top: ${({ theme }) => theme.sizes.xl};
`

export const FootnoteContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: ${({ theme }) => theme.sizes.xs};
  border-top: 1px solid;
  border-top-color: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.body};
`

export const FootnoteContentLink = styled(Link)`
  display: block;
  color: ${({ theme }) => theme.colors.primary};
  transition: color 300ms;

  &:hover {
    color: ${({ theme }) => theme.colors.body};
  }

  &:not(:first-child) {
    margin-left: ${({ theme }) => theme.sizes.xs};
  }
`
