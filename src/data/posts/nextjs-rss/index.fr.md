---
title: "Next.js (SSG) & flux RSS"
excerpt: "Ajouter un flux RSS à un projet Next.js (SSG)"
date: "2021-02-10"
---

_Face à la multiplication des contenus en ligne, l'accès à l'information peut parfois s'avérer plus chronophage qu'on ne le souhaiterait... Qu'il s'agisse d'actualités générales ou plus ciblées, il existe pourtant un moyen simple de faciliter sa veille quotidienne : les flux [RSS](https://fr.wikipedia.org/wiki/RSS)._

_Alors pourquoi ne pas en mettre un en place sur son site web (statique), et gagner ainsi en visibilité ?_

> Sur la base d'un projet Next.js (SSG), nous allons voir comment ajouter simplement un flux RSS pour des articles rédigés en Markdown.

## Pré-requis
1. [Node.js](https://nodejs.org/fr/) (>= 10.13)
2. Un projet Next.js (existant ou généré via [`npx create-next-app`](https://nextjs.org/docs/getting-started#setup))

__Ce site web a servi de base à cet article, n'hésitez donc pas à vous référer au [code source](https://gitlab.com/soykje/soykje.gitlab.io/-/tree/master) pour plus de détails !__

## Générer le flux RSS
S'il est tout à fait possible de générer le(s) fichier(s) de flux de façon complètement manuelle, il n'est pas pour autant nécessaire de réinventer la roue ! :man-cartwheeling: Ici, nous nous appuierons donc sur le _package_ [`feed`](https://github.com/jpmonette/feed), qui simplifiera l'écriture de notre fonction de génération de flux :

```javascript
import fs from 'fs'
import { Feed } from 'feed'
import { remark } from 'remark'
import html from 'remark-html'
import gemoji from 'remark-gemoji'

import { LOCALES } from '@i18n/constants'
import { getPosts } from '@api/posts'
import { getI18n } from '@api/i18n'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL
const AUTHOR_NAME = process.env.NEXT_PUBLIC_SITE_NAME
const TWITTER_USERNAME = process.env.NEXT_PUBLIC_TWITTER_USERNAME

const markdownToHtml = (markdown) =>
  remark().use(html).use(gemoji).processSync(markdown).toString()

const generateRssFeed = () => {
  const author = {
    name: AUTHOR_NAME,
    link: `https://twitter.com/${TWITTER_USERNAME}`,
  }

  LOCALES.forEach((lang) => {
    const { description } = getI18n(lang, 'home').home

    const feed = new Feed({
      title: `${AUTHOR_NAME}'s blog feed`,
      description: Object.values(description).join(' '),
      id: `${SITE_URL}/${lang}`,
      link: `${SITE_URL}/${lang}`,
      language: lang,
      generator: 'Next.js using Feed',
      feedLinks: {
        rss2: `${SITE_URL}/${lang}/feed.xml`,
      },
      author,
    })

    const posts = getPosts(['title', 'excerpt', 'content'], lang)

    posts.forEach((post) => {
      feed.addItem({
        title: post.title,
        id: `${SITE_URL}/${lang}/blog/${post.slug}`,
        link: `${SITE_URL}/${lang}/blog/${post.slug}`,
        description: post.excerpt,
        content: markdownToHtml(post.content),
        date: new Date(post.date),
        author: [author],
      })
    })

    fs.mkdirSync(`./public/${lang}`, { recursive: true })
    fs.writeFileSync(`./public/${lang}/feed.xml`, feed.rss2(), 'utf8')
  })
}

generateRssFeed()
```

Le code se découpe en deux parties, assez simples : on génère le flux avec ses informations générales, puis on boucle sur nos contenus (_posts_) pour générer nos items.

L'ensemble est ensuite écrit dans un fichier `.xml`, au format RSS 2.0. Plusieurs formats sont possibles, néanmoins son excellent support rend l'ajout d'autres formats souvent superflu.

Nos contenus sont ici rédigés en Markdown. En s'appuyant sur l'écosystème [`remark`](https://github.com/remarkjs/remark), on pourra ainsi assez facilement ajouter à nos items de flux le contenu (exhaustif) de nos articles, converti au format `HTML`. C'est souvent une pratique recommandée, bien que non nécessaire.

Enfin, dans le [cas d'un site multilingue](https://gitlab.com/soykje/soykje.gitlab.io/-/blob/master/src/scripts/rss.js#L24), il suffira d'adapter le code, pour générer autant de fichier que de langues supportées.

## Aider les robots
Pour faciliter la vie des navigateurs et autres robots d'indexation, et les aider à trouver notre flux RSS, il faudra penser à ajouter dans le `<head />` de notre document, un lien vers celui-ci :

```jsx
<link
  rel="alternate"
  type="application/rss+xml"
  title={`${AUTHOR_NAME}'s blog feed`}
  href="/feed.xml"
/>
```

## Mise à jour du script de _build_
Maintenant que tout est en place, il reste encore à faire l'appel à cette fonction. Dans le cadre d'un site _SSG_, cet appel se fera, en toute logique, au moment de la phase de _build_.

Notre script utilise les modules ES (ESM), en partie pour permettre l'import de fonctions utilisées ailleurs dans le projet (comme celles de la récupération des contenus). Pour l'utiliser en _CLI_, il faut donc dans un premier temps, adapter notre configuration _Webpack_, via le fichier `next.config.js` :

```javascript
module.exports = {
  // ...

  webpack: (config, { dev, isServer }) => {
    if (!dev && isServer) {
      const originalEntry = config.entry;

      config.entry = async () => {
        const entries = await originalEntry()

        // These scripts can import components from the app
        // and use ES modules
        return { ...entries, 'scripts/rss-generate': './src/scripts/rss.js' }
      }
    }

    return config
  }
}
```

Notre script sera ainsi compilé par Webpack dans le dossier `.next/server`. Il ne restera plus qu'à l'appeler via un script de notre fichier `package.json`, qui prendra en charge la génération de notre RSS :

```json
"scripts": {
  // ...
  "build": "next build && npm run rss:generate",
  "rss:generate": "node ./.next/server/scripts/rss-generate"
}
```

## :tada:
**Et voilà !** L'ajout d'un flux RSS est un véritable plus pour un site web (en particulier un blog ou autre site d'actualités), permettant aux utilisateurs de suivre vos contenus de façon simple, sans avoir à jongler entre une multitide d'onglets... C'est en outre un bon moyen d'améliorer sa visibilité en ligne, alors pourquoi se priver ? :slightly_smiling_face:
