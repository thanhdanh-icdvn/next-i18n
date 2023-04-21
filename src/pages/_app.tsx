import type { ReactElement } from 'react'
import type { AppProps } from 'next/app'

import { LocaleProvider } from '@i18n/context'
import { ThemeProvider } from '@styles/themes'

import GlobalStyle from '@styles/global'
import ResetStyle from '@styles/reset'

const MyApp = ({ Component, pageProps }: AppProps): ReactElement => (
  <ThemeProvider defaultTheme="light">
    <LocaleProvider lang={pageProps.lang}>
      <Component {...pageProps} />
    </LocaleProvider>

    <ResetStyle />
    <GlobalStyle />
  </ThemeProvider>
)

export default MyApp
