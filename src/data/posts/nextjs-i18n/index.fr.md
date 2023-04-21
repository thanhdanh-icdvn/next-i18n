---
title: "Next.js (SSG) & i18n"
excerpt: "Ajouter le support multilingue à un projet Next.js (SSG)"
date: "2020-11-03"
---

_L'ajout du support multilingue (i18n) pour un site ou une application web est un véritable enjeu, car cela soulève très souvent des problématiques importantes telles que la structure de la donnée, le_ routing _.. Il existe certes des solutions, mais trop souvent celles-ci s'avèrent trop rigides et/ou complexes à mettre en place, en particulier dans un contexte de site statique._

_Pourtant cette complexité est très souvent superflue : graĉe à_ React Context _et aux routes dynamiques de Next.js, l'ajout du support multilingue peut s'avérer bien plus simple qu'il n'y parait !_

> Sur la base d'un projet Next.js, nous allons voir comment mettre en place simplement un support multilingue, grâce à *React Context* et aux routes dynamiques !

## Pré-requis
1. [Node.js](https://nodejs.org/fr/) (>= 10.13)
2. Un projet Next.js (existant ou généré via [`npx create-next-app`](https://nextjs.org/docs/getting-started#setup))

__Ce site web a servi de base à cet article, n'hésitez donc pas à vous référer au [code source](https://gitlab.com/soykje/soykje.gitlab.io/-/tree/master) pour plus de détails !__

## Localisation
Pour partager la localisation entre les pages et les composants, nous allons utiliser _React Context_, parfaitement adapté ici :

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

A noter que pour s'assurer que le routing reste bien cohérent avec le contexte, on effectuera une vérification entre les deux, pour les garder synchronisés.

Pour la suite, il faudra aussi tenir compte de quelques spécificités du _framework_, en modifiant légèrement le fichier `_document.js` pour qu'il récupère bien la `query` et la transmette bien par la suite, en particulier pour l'attribut `lang` de notre page HTML :

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

Pour finir, il suffira de déclarer le `<LocaleProvider />` dans `_app.js`, en lui passant les _props_ du document comme valeur de langue :

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

Le contexte React est désormais en place, et correctement connecté avec l'ensemble de l'applicatif ! :electric_plug:

## Traductions
Les traductions seront créées sous la forme de fichiers JSON : des fichiers pour les traductions communes, et d'autres par page. On adoptera la convention de nommage suivante : `<lang>.json` et `<pagename>.<lang>.json`.

Pour récupérer nos traductions dans les pages, nous allons créer une simple fonction qui ira chercher dans nos fichiers le bloc de traductions souhaitées, selon le _namespace_ et la langue déclarés :

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

Ces traductions seront par la suite récupérées via la méthode `getStaticProps()` mise à disposition par Next.js :

```javascript
export async function getStaticProps({ params }) {
  const lang = params?.lang || DEFAULT_LOCALE

  const translations = getI18n(lang, 'home')

  return { props: { translations } }
}
```

Il faut désormais pouvoir _consommer_ ce bloc de traductions... Pour cela, rien de plus simple qu'un _hook_, s'appuyant sur le contexte React précédemment mis en place :

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

Ce _hook_ retournera donc la langue, mais aussi une fonction `t()` permettant de récupérer une traduction sur la base d'une _clé_ passée en argument.

Les données de traductions seront par défaut les traductions communes (importées directement), et le cas échéant les traductions de la page.

A noter qu'en cas d'indisponibilité de la traduction, `t()` retournera simplement la clé qui lui aura été passée, sous la forme d'une chaîne de caractères.

## Localisation des pages et routing
Nos données sont maintenant prêtes à être exploitées au sein de notre projet. Il reste maintenant à localiser nos pages à proprement parler, et c'est là qu'intervient le [routing dynamique](https://nextjs.org/docs/routing/dynamic-routes) de Next.js !

Pour commencer, nous allons donc déplacer l'ensemble de nos pages dans un dossier `[lang]`. Ce faisant, nous indiquons simplement à Next.js que nos pages dépendront d'un paramètre de `query` nommé `lang`, qui sera interprété ensuite au niveau du `_document.js`, modifié en ce sens.

### Construction des chemins de pages
Puisque l'on utilise des routes dynamiques, nous devons définir les chemins pour chacune de nos pages, afin de les rendre accessibles au routeur. Nous utilisons ici la fonction `getStaticPaths`, là aussi spécifique à la génération statique :

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

Rien de bien compliqué ici : on retourne les chemins pour l'ensemble des langues supportées, déclarées dans la constante `LOCALES`.

### Routing
Toutes nos urls de pages sont désormais _préfixées_ par un `/[lang]`, et à ce stade tout fonctionne comme il se doit... Mais que se passe-t-il si l'on omet le paramètre de langue dans notre url ?... Une **404** !!! :scream:

Pour éviter cela, mais aussi pour améliorer notre SEO, nous allons donc créer un fichier `index.js` à la racine de notre dossier `pages` :

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

Concrètement, ce fichier se chargera simplement de rediriger l'utilisateur vers la page correspondant à la langue du document HTML (et du contexte). Et pour éviter que cette page sans contenu ne soit indexée par les moteurs de recherches, on ajoute une `<meta name="robots" />` adaptée.

La redirection se fait ici via le routeur Next.js, côté client (cf. `useEffect`). Cela permettra à la redirection d'être quasi imperceptible pour l'utilisateur !

## :tada:
**Et voilà !** Malgré les nombreuses modifications de fichiers, la logique reste au final assez simple, nous permettant ainsi de construire un projet multilingue souple et adaptable au besoin. Il ne restera plus ensuite qu'à peaufiner le code à l'envie, en ajoutant par exemple un sélecteur de langue, une gestion des erreurs (en cas de traduction manquante sur une page), ... :slightly_smiling_face:

----

**NB: Un grand merci à [@BiscuiTech](https://twitter.com/BiscuiTech) et [@filipcodes](https://twitter.com/filipcodes) pour leur travail qui m'a grandement inspiré ([ici](https://biscui.tech/en/blog/i18n-ssg-nextjs-app) et [ici](https://w11i.me/how-to-build-multilingual-website-in-next-js)). Et si le sujet vous intéresse, n'hésitez pas non plus à suivre les [discussions](https://github.com/vercel/next.js/discussions/17078) sur le dépôt officiel Next.js ! Le _routing_ internationalisé annoncé en version 10 [ne supporte malheureusement pas encore l'export statique](https://nextjs.org/docs/advanced-features/i18n-routing#how-does-this-work-with-static-generation), mais on croise les doigts... :crossed_fingers:**
