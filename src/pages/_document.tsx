import type { ReactElement } from 'react'

import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
  DocumentInitialProps,
} from 'next/document'

import type { QParams } from '@typings/global'
import type { Locale } from '@typings/i18n'

import { ServerStyleSheet } from 'styled-components'

import { DEFAULT_LOCALE } from '@i18n/constants'

export default class MyDocument extends Document<{ lang: Locale }> {
  static async getInitialProps(
    ctx: DocumentContext
  ): Promise<DocumentInitialProps & { lang: Locale }> {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage
    const query = ctx.query as QParams

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)

      return {
        ...initialProps,
        lang: query?.lang || DEFAULT_LOCALE,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render(): ReactElement {
    return (
      <Html lang={this.props.lang}>
        <Head>
          <link
            rel="preload"
            href="/fonts/Montserrat400.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />

          <link
            rel="preload"
            href="/fonts/Montserrat500.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />

          <link
            rel="preload"
            href="/fonts/PlayfairDisplay500.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
