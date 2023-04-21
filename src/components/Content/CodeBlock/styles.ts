import styled from 'styled-components'
import { math } from 'polished'

import media from '@styles/media'

export const Pre = styled.pre`
  border-radius: 0;
  font-family: ${({ theme }) => theme.typography.code.fontFamily};
  font-size: ${({ theme }) => theme.typography.code.fontSize._};
  font-weight: ${({ theme }) => theme.typography.code.fontWeight};
  line-height: ${({ theme }) => theme.typography.code.lineHeight};
  margin-left: ${({ theme }) => math(`${theme.layout.gutter} / -2`)};
  margin-right: ${({ theme }) => math(`${theme.layout.gutter} / -2`)};
  padding: ${({ theme }) => theme.sizes.xs};
  max-height: 70vh;

  ${media.md} {
    font-size: ${({ theme }) => theme.typography.code.fontSize.md};
    border-radius: 0.25em;
    margin-left: 0;
    margin-right: 0;
    max-height: 80vh;
  }

  &:not(:first-child) {
    margin-top: ${({ theme }) => theme.layout.gutter};
  }
  &:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.layout.gutter};
  }
`

export const Line = styled.div`
  display: table-row;
`

export const LineNo = styled.span`
  display: table-cell;
  text-align: right;
  padding-right: ${({ theme }) => theme.sizes.sm};
  user-select: none;
  opacity: 0.25;
`

export const LineContent = styled.span`
  display: table-cell;
`
