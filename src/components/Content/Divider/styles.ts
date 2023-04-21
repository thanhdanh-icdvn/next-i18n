import styled, { DefaultTheme } from 'styled-components'
import { math } from 'polished'

export const DividerLine = styled.hr<{ dividerColor: keyof DefaultTheme['colors'] }>`
  border: none;
  margin-top: ${({ theme }) => math(`${theme.layout.gutter} * 2`)};
  margin-bottom: ${({ theme }) => math(`${theme.layout.gutter} * 2`)};
  background-color: ${({ theme, dividerColor }) => theme.colors[dividerColor]};
  height: 1px;
`

export const DividerDots = styled(DividerLine)`
  background-color: transparent;
  text-align: center;
  height: auto;

  &:before {
    content: '* * *';
    display: block;
    font-size: 1em;
    line-height: 1;
    letter-spacing: 0.5em;
    height: 0.5em;
    color: ${({ theme, dividerColor }) => theme.colors[dividerColor]};
  }
`
