import type { DefaultTheme } from 'styled-components'
import { theme } from './themes'

const mediaQuery = (
  breakpoint: keyof DefaultTheme['layout']['breakpoints']
): string => `@media (min-width: ${theme.layout.breakpoints[breakpoint]}px)`

const media: Record<keyof DefaultTheme['layout']['breakpoints'], string> = {
  sm: mediaQuery('sm'),
  md: mediaQuery('md'),
  lg: mediaQuery('lg'),
  xl: mediaQuery('xl'),
}

export default media
