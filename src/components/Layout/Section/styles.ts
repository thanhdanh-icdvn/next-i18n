import styled from 'styled-components'

import media from '@styles/media'

import { Text } from '@components/Content'
import Link from '@components/Link'

export const SectionBase = styled.section`
  &:not(:first-child) {
    margin-top: ${({ theme }) => theme.sizes.xl};
  }
`

export const SectionHeader = styled.header`
  padding-bottom: ${({ theme }) => theme.sizes.sm};
`

export const SectionHeading = styled(Text)`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`

export const SectionSeeMore = styled(Link)`
  display: block;
  text-decoration: none;
  color: ${({ theme }) => theme.colors.primary};
  margin-left: ${({ theme }) => theme.sizes.sm};
`

export const SectionTitle = styled(Link)`
  color: inherit;
  text-decoration: none;
`

export const SectionSubtitle = styled(Text)`
  ${media.md} {
    padding-right: ${({ theme }) => theme.sizes.sm};
  }
`

export const SectionContent = styled.div`
  ${media.md} {
    padding-right: ${({ theme }) => theme.sizes.sm};
  }
`
