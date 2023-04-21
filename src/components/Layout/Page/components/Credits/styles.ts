import styled from 'styled-components'

import { Container } from '@components/Layout'
import { Text } from '@components/Content'
import Link from '@components/Link'

export const CreditsBase = styled.footer`
  display: block;
  padding-top: ${({ theme }) => theme.sizes.xs};
  padding-bottom: ${({ theme }) => theme.sizes.xs};
`

export const CreditsContainer = styled(Container)`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`

export const CreditsLicenseText = styled(Text)`
  margin-right: ${({ theme }) => theme.sizes.xs};
`

export const CreditsLicenseBadge = styled(Link)`
  display: block;
  flex: 0 0 auto;
  color: ${({ theme }) => theme.colors.hint};
  transition: color 300ms;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`
