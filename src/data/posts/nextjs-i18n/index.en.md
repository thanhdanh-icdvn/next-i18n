---
title: "Next.js (SSG) & i18n"
excerpt: "Adding multilingual support to a Next.js project (SSG)"
date: "2020-11-03"
---

_Adding multilingual support (i18n) for a site or a web application is a real stake, as it often raises important questions such as the data structure, the routing ... Of course there are solutions, but too often these are too rigid and/or complex to set up, particularly in a static site context._

_However, this complexity is very often superfluous: thanks to_ React Context _and the dynamic routes from Next.js, adding multilingual support can be much easier than it seems!_

> Based on a Next.js project, we will see how to easily set up multilingual support, thanks to *React Context* and dynamic routes!

## Prerequisites
1. [Node.js](https://nodejs.org/en/) (>= 10.13)
2. A Next.js project (existing one or generated through [`npx create-next-app`](https://nextjs.org/docs/getting-started#setup))

__This website was the starting point for this article, so do not hesitate to refer to its [source code](https://gitlab.com/soykje/soykje.gitlab.io/-/tree/master) for more details!__

## Localization
In order to share localization between pages and components, we'll use _React Context_, which is perfectly suited here:

```jsx
import LocaleContext from './LocaleContext'
import { LOCALES, DEFAULT_LOCALE } from '../constants'

const LocaleProvider = ({ lang, children }) => {
  const [locale, setLocale] = useState(lang)
  const { query } = useRouter()

  // Sync context with router
  useEffect(() => {
    if (LOCALES.includes(query.lang) && locale !== query.lang) {
      setLocale(query.lang)
    }
  }, [query.lang, locale])

  return (
    <LocaleContext.Provider value={{ locale }}>
      {children}
    </LocaleContext.Provider>
  )
}
```

Note that to ensure that the routing remains consistent with the context, we will perform a check between both, to keep them synchronized.

Also, we will have to take into account some specificities of the _framework_, by slightly modifying the `_document.js` file so that it retrieves the `query` and transmits it afterwards, in particular for the HTML `lang` attribute:

```jsx
import { ServerStyleSheet } from 'styled-components'
import { DEFAULT_LOCALE } from '@i18n/constants'

export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage
    const { query } = ctx

    try {
      ctx.renderPage = () => originalRenderPage({
        enhanceApp: (App) => (props) => sheet.collectStyles(
          <App {...props} />)
        }
      )

      const initialProps = await Document.getInitialProps(ctx)

      return {
        ...initialProps,
        lang: query?.lang,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html lang={this.props.lang || DEFAULT_LOCALE}>
        <Head />

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
```

Finally, we just declare the `<LocaleProvider />` in `_app.js`, passing the _props_ of the document to it as the language value:

```jsx
import { LocaleProvider } from '@i18n/context'

export default class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props

    return (
      <LocaleProvider lang={pageProps.lang}>
        <Component {...pageProps} />
      </LocaleProvider>
    )
  }
}
```

The React context is now in place, and correctly connected with the entire application! :electric_plug:

## Translations
The translations will be created as JSON files: some for common translations, and others per page. We will use the following naming convention: `<lang>.json` et `<pagename>.<lang>.json`.

To retrieve translations in our pages, we are going to create a simple function that will look in our files for the desired translations blocks, according to the _namespace_ and the language previously declared:

```javascript
import fs from 'fs'
import { join } from 'path'

/**
 * getI18n()
 * @params: lang (required), namespace (required)
 * @returns: Array of object(s)
 */
export const getI18n = (lang, namespace) => {
  const i18nDirectory = join(process.cwd(), 'src/data/i18n')
  const i18nFiles = fs.readdirSync(i18nDirectory)
  const i18nSlug = `${namespace}.${lang}.json`
  const i18nPath = join(i18nDirectory, i18nSlug)
  
  let i18nContent = {}

  if (i18nFiles.includes(i18nSlug)) {
    i18nContent = { [namespace]: JSON.parse(fs.readFileSync(i18nPath, 'utf8'))[0] }
  }

  return i18nContent
}
```

These translations will then be retrieved via the `getStaticProps ()` method made available by Next.js:

```javascript
export async function getStaticProps({ params }) {
  const lang = params?.lang || DEFAULT_LOCALE

  const translations = getI18n(lang, 'home')

  return { props: { translations } }
}
```

Now we want to be able to _consume_ this block of translations... For that, nothing simpler than a _hook_, based on the React context previously set up:

```javascript
import * as common from '@data/i18n/common'

export const useLocale = (translations) => {
  const { locale } = useContext(LocaleContext)
  const i18nCommon = locale ? common[locale] : {}
  const i18nScoped = translations || {}

  const i18nContent = {
    common: i18nCommon,
    ...i18nScoped,
  }

  const t = (key) => {
    const kArray = key.split('.')

    // Parsing possibly nested object
    let res = i18nContent

    kArray.forEach((k) => {
      res = typeof res === 'string' ? res : res[k]
    })

    return typeof res === 'string' ? res : key
  }

  return { t, lang: locale }
}
```

This _hook_ will return the language, but also a `t()` function allowing us to retrieve a translation on the basis of a _key_ passed as an argument.

The translation data will be the common translations by default (imported directly), and where applicable the translations of the page.

Note that if the translation is unavailable, t() will simply return the key that has been passed to it, as a string.

## Localization of pages and routing
Our data is now ready to be used within our project. But we still need to locate our pages (strictly speaking), and this is where the [dynamic routing](https://nextjs.org/docs/routing/dynamic-routes) from Next.js comes in!

To start with, we are going to move all of our pages to a `[lang]` folder. Doing so, we simply tell Next.js that our pages will depend on a `query` parameter named `lang`, which will then be interpreted at the level of the `_document.js`, modified in this sense.

### Building page paths
Since we're using dynamic routes, we need to define the paths for each of our pages, in order to make them accessible to the router. We use here the `getStaticPaths` function, here again specific to static generation:

```jsx
import { LOCALES } from '@i18n/constants'

//...

export async function getStaticPaths() {
  return {
    paths: LOCALES.map((lang) => (
      {
        params: { lang }
      }
    )),
    fallback: false
  }
}
```

Nothing very complicated here: we return the paths for all the supported languages, declared in the constant `LOCALES`.

### Routing
All our page urls are now _prefixed_ with a `/[lang]`, and at this point everything is working as it should... But what happens if we omit the language parameter in our url?... A **404**!!! :scream:

To avoid this, but also to improve our SEO, we're going to create an `index.js` file at the root of our `pages` folder:

```jsx
import { getI18n } from '@api/i18n'

import { useLocale } from '@i18n/context'
import { DEFAULT_LOCALE } from '@i18n/constants'
import { getInitialLocale } from '@i18n/utils'

export default function Index({ translations }) {
  const { t } = useLocale(translations)
  const router = useRouter()

  useEffect(() => {
    router.replace('/[lang]', `/${getInitialLocale()}`)
  })

  return (
    <Head>
      // Here you should put your SEO meta tags...

      <meta key="robots" name="robots" content="noindex, nofollow" />
    </Head>
  )
}
```

Concretely, this file will simply take care of redirecting the user to the page corresponding to the language of the HTML document (and of the context). And to prevent this page with no content from being indexed by search engines, we add a suitable `<meta name="robots" />`.

The redirection is done here via the Next.js router, on the client side (see `useEffect`). This will allow the redirection to be almost imperceptible to the user!

## :tada:
**Et voilà !** Despite the many modifications, the logic remains quite simple in the end, allowing us to build a multilingual project, flexible and adaptable to our needs. All you have to do now is fine-tune the code as desired, for example by adding a language selector, error handling (in the event of a missing translation on a page), ... :slightly_smiling_face:

----

**NB: A big thank you to [@BiscuiTech](https://twitter.com/BiscuiTech) and [@filipcodes](https://twitter.com/filipcodes) for their inspiring work ([here](https://biscui.tech/en/blog/i18n-ssg-nextjs-app) and [here](https://w11i.me/how-to-build-multilingual-website-in-next-js)). And if the topic interests you, don't hesitate to follow the [discussions](https://github.com/vercel/next.js/discussions/17078) either, from the official Next.js repository! The internationalized routing announced in version 10 unfortunately [does not yet support static export](https://nextjs.org/docs/advanced-features/i18n-routing#how-does-this-work-with-static-generation), but maybe one day..:crossed_fingers:**
