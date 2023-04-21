import styled from 'styled-components'

import media from '@styles/media'

import type { GridProps } from '../Grid'

export const GridBase = styled.div<GridProps>`
  display: block;

  ${media.md} {
    display: grid;
    grid-auto-flow: row;
    grid-template-columns: ${({ columns }) => `repeat(${columns}, 1fr)`};
    grid-column-gap: ${({ gutter, theme }) => (gutter ? theme.layout.gutter : null)};
  }
`
