import type { ReactElement } from 'react'
import type { DefaultTheme } from 'styled-components'

import { DividerLine, DividerDots } from './styles'

interface DividerProps {
  variant?: 'line' | 'dots'
  color?: keyof DefaultTheme['colors']
}

const Divider = ({
  variant = 'line',
  color = 'border',
}: DividerProps): ReactElement => {
  const Component = variant === 'line' ? DividerLine : DividerDots

  return <Component dividerColor={color} />
}

export default Divider
