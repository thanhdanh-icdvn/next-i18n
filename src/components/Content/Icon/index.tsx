import type { ReactElement } from 'react'

import { withTheme, DefaultTheme } from 'styled-components'
import type { StyledIcon } from '@styled-icons/styled-icon'
import { math, stripUnit } from 'polished'

import { IconWrapper } from './styles'

export interface IconProps {
  as: StyledIcon
  size?: keyof DefaultTheme['sizes']
  wrapper?: keyof DefaultTheme['sizes']
  theme: DefaultTheme
}

const Icon = ({ as, size = 'sm', wrapper, theme }: IconProps): ReactElement => {
  const Component = as
  const px = (rem: string | number): string =>
    math(`${stripUnit(rem)} * ${theme.typography.default.fontSize}`)

  if (wrapper) {
    return (
      <IconWrapper size={wrapper}>
        <Component size={px(theme.sizes[size])} />
      </IconWrapper>
    )
  }

  return <Component size={px(theme.sizes[size])} />
}

export default withTheme(Icon)
