import styled, { DefaultTheme } from 'styled-components'

export const IconWrapper = styled.span<{ size: keyof DefaultTheme['sizes'] }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ theme, size }) => theme.sizes[size]};
  height: ${({ theme, size }) => theme.sizes[size]};
`
