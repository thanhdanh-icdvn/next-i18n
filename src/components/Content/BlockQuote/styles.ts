import styled from 'styled-components'
import { math, rem } from 'polished'

export const BlockQuoteBase = styled.blockquote`
  font-style: italic;
  border-left-style: solid;
  border-width: 4px;
  border-color: ${({ theme }) => theme.colors.border};
  padding-left: ${({ theme }) => math(`${theme.layout.gutter} / 2 - ${rem('3px')}`)};
  margin-left: ${({ theme }) => math(`${theme.layout.gutter} / -2`)};
  transition: border-width 300ms, margin-left 300ms, padding-left 300ms;

  em {
    font-style: normal;
  }

  &:not(:first-child) {
    margin-top: ${({ theme }) => theme.layout.gutter};
  }
  &:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.layout.gutter};
  }
`
