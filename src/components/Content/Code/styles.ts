import styled from 'styled-components'

export const CodeBase = styled.code`
  display: inline-block;
  position: relative;
  vertical-align: 0.0625em;
  font-family: ${({ theme }) => theme.typography.code.fontFamily};
  font-size: ${({ theme }) => theme.typography.code.fontSize._};
  font-weight: ${({ theme }) => theme.typography.code.fontWeight};
  font-style: normal;
  padding: 0.125em 0.325em;
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 0.25em;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    background-color: ${({ theme }) => theme.colors.primary};
    opacity: 0.125;
  }
`
