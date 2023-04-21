import styled from 'styled-components'

import media from '@styles/media'

import { Text } from '@components/Content'

export const BannerBase = styled.header`
  display: flex;
  align-items: center;
  overflow: hidden;
  padding-top: ${({ theme }) => theme.sizes.xl};
  padding-bottom: ${({ theme }) => theme.sizes.xl};
  min-height: 50vh;

  ${media.md} {
    min-height: 66.6666vh;
  }

  &:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.sizes.xl};
  }
`

export const BannerTitle = styled(Text)`
  margin-left: -0.0375em;

  &:not(:last-child) {
    margin-bottom: 0.25em;
  }
`
