import type { ReactElement, PropsWithChildren } from 'react'

import { ThemeProvider as StyledThemeProvider } from 'styled-components'
import { ThemeProvider as NextThemeProvider } from 'next-themes'

import { theme, ThemeGlobals } from '../constants'

const ThemeProvider = ({
  defaultTheme = 'light',
  children,
}: PropsWithChildren<{ defaultTheme: string }>): ReactElement => {
  return (
    <>
      <ThemeGlobals />
      <NextThemeProvider
        themes={['light', 'dark']}
        defaultTheme={defaultTheme}
        disableTransitionOnChange
      >
        <StyledThemeProvider theme={theme}>{children}</StyledThemeProvider>
      </NextThemeProvider>
    </>
  )
}

export default ThemeProvider
