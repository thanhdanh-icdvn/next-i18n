import styled from 'styled-components'
import { math } from 'polished'

export const PageBase = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  min-height: ${({ theme }) =>
    `calc(100vh - ${math(`${theme.sizes.md} + ${theme.sizes.xs} * 2`)})`};
`

export const PageMain = styled.main`
  margin-bottom: auto;
  padding-bottom: ${({ theme }) => math(`${theme.sizes.xl} * 3.75`)};
`
