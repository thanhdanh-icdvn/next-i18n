import styled, { DefaultTheme } from 'styled-components'
import { math } from 'polished'

import media from '@styles/media'

import type { ContainerProps } from '../Container'

export const ContainerBase = styled.div<
  ContainerProps & {
    size: keyof DefaultTheme['layout']['breakpoints']
  }
>`
  width: 100%;
  max-width: ${({ theme, size }) => `${theme.layout.breakpoints[size]}px`};
  margin: 0 auto;
  padding-left: ${({ theme }) => math(`${theme.layout.gutter} / 2`)};
  padding-right: ${({ theme }) => math(`${theme.layout.gutter} / 2`)};

  ${({ size }) => media[size]} {
    padding-left: ${({ theme }) => theme.layout.gutter};
    padding-right: ${({ theme }) => theme.layout.gutter};
  }
`
