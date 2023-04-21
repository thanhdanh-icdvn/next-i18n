import styled, { css } from 'styled-components'

import Text from '../Text'
import MetaData from '../MetaData'
import Link from '@components/Link'

export const CardBase = styled(Link)<{ isCompact: boolean }>`
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  z-index: 0;
  outline: 0;
  text-decoration: none;
  padding-top: ${({ theme, isCompact }) =>
    isCompact ? theme.sizes.xs : theme.sizes.sm};
  padding-bottom: ${({ theme, isCompact }) =>
    isCompact ? theme.sizes.xs : theme.sizes.sm};

  &:before,
  &:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    color: ${({ theme }) => theme.colors.border};
    border-bottom: 1px solid;
    transition: color 300ms;
  }

  &:before {
    top: -1px;
  }
  &:after {
    bottom: 0;
  }

  ${({ isCompact }) =>
    !isCompact &&
    css`
      transition: z-index 300ms;

      &:hover {
        z-index: 1;

        &:before,
        &:after {
          color: ${({ theme }) => theme.colors.primary};
        }
      }
    `};
`

export const CardTitle = styled(Text)`
  ${({ color }) =>
    color === 'body' &&
    css`
      ${CardBase}:hover & {
        color: ${({ theme }) => theme.colors.primary};
      }
    `};
`

export const CardBody = styled(Text)`
  ${CardBase} & {
    color: ${({ theme }) => theme.colors.muted};
  }
  ${CardBase}:hover & {
    color: ${({ theme }) => theme.colors.body};
  }

  &:not(:first-child) {
    margin-top: 0;
  }

  &:not(:last-child) {
    margin-bottom: 0.5em;
  }
`

export const CardMetaData = styled(MetaData)`
  ${CardBase} & {
    color: ${({ theme }) => theme.colors.hint};
  }

  ${CardBase}:hover & {
    color: ${({ theme }) => theme.colors.muted};
  }

  &:not(:first-child) {
    margin-top: auto;
  }
`
