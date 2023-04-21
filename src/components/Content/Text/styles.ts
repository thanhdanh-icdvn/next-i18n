import type { TextVariant, TextColor, HTMLElementTagName } from './types'
import styled, { css } from 'styled-components'
import media from '@styles/media'

const isHead = (t: HTMLElementTagName): boolean =>
  ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(t)

export const TextBase = styled.div<{
  as: HTMLElementTagName
  variant: TextVariant
  textColor: TextColor
}>`
  ${({ theme, variant, as }) =>
    variant !== 'inherit'
      ? css`
          font-family: ${theme.typography[variant].fontFamily};
          font-size: ${theme.typography[variant].fontSize._};
          line-height: ${theme.typography[variant].lineHeight};
          font-weight: ${as === 'strong'
            ? theme.typography[variant].fontWeightBold
            : theme.typography[variant].fontWeight};

          ${media.sm} {
            font-size: ${theme.typography[variant].fontSize.sm};
          }

          ${media.md} {
            font-size: ${theme.typography[variant].fontSize.md};
          }
        `
      : null};

  color: ${({ theme, textColor }) =>
    textColor !== 'inherit' ? theme.colors[textColor] : 'inherit'};

  transition: color 300ms, opacity 300ms;

  ${({ as }) =>
    isHead(as)
      ? css`
          &:not(:first-child) {
            margin-top: 1.5em;
          }
          &:not(:last-child) {
            margin-bottom: 0.5em;
          }
        `
      : css`
          &:not(:first-child) {
            margin-top: 1em;
          }
        `};
`
