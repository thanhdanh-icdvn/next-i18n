import styled from 'styled-components'

export const HeadblockBase = styled.header`
  display: flex;
  align-items: center;
  padding-top: ${({ theme }) => theme.sizes.xl};
  padding-bottom: ${({ theme }) => theme.sizes.xl};
  min-height: 50vh;

  &:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.sizes.md};
  }
`
