import styled from 'styled-components'
import type { LinkProps } from '../Link'

export const LinkInline = styled.a<{
  color: LinkProps['color']
}>`
  font-style: normal;
  color: ${({ theme, color }) =>
    color && color !== 'inherit' ? theme.colors[color] : 'inherit'};
  transition: color 300ms;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`
