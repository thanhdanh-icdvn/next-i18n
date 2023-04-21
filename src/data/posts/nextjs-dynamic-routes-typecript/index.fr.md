---
title: "Routes dynamiques avec Next.js & Typescript"
excerpt: "Comment éviter les erreurs de typage en utilisant les routes dynamiques de Next.js"
date: '2021-06-11'
---

_Le système de_ routing _de Next.js, basé sur la structure du dossier `pages`, est à la fois simple et puissant. Il nous permet par ailleurs de créer des routes dynamiques, basées sur des_ query params _(ex: articles de blog)._

_Dans ce contexte, et en utilisant Typescript avec les types fournis par Next.js, nous nous retrouvons pourtant avec une erreur de typage lorsque l'on utilise les méthodes de_ [data fetching](https://nextjs.org/docs/basic-features/data-fetching) _(`getStaticProps` ou `getServerSideProps`) mises à disposition par le framework_ :confounded:.

_Comment résoudre ce problème ? La documentation n'est malheureusement pas très explicite sur ce cas d'usage, et pourtant la solution est relativement simple !_

> Sur la base d'un projet Next.js, nous allons voir comment adapter le typage des méthodes de _data fetching_ de Next.js, et ainsi éviter toute erreur de ce type :
```
Property 'slug' does not exist on type 'ParsedUrlQuery | undefined'
```

## Pré-requis
1. [Node.js](https://nodejs.org/fr/) (>= 10.13)
2. Un projet Next.js (existant ou généré via [`npx create-next-app`](https://nextjs.org/docs/getting-started#setup)) avec Typescript

__Ce site web a servi de base à cet article, n'hésitez donc pas à vous référer au [code source](https://gitlab.com/soykje/soykje.gitlab.io/-/tree/master) pour plus de détails !__

## Les types Next.js
Next.js met à disposition des fonctions spécifiques pour la récupération de données, que l'on soit en génération statique (SSG) ou côté serveur (SSR).

Voyons ici le cas de la génération statique, avec les fonctions `getStaticProps` et `getStaticPaths` (la logique est similaire pour la méthode `getServerSideProps`).

Comme l'indique la [documentation](https://nextjs.org/docs/basic-features/data-fetching#typescript-use-getstaticprops), Next.js met à disposition des types dédiés à chacune de ces fonctions. Pourtant dans le cas des routes dynamiques, l'utilisation du type tel qu'indiqué dans la documentation ne suffit pas :
```typescript
import type { ReactElement } from 'react'
import type { GetStaticProps, GetStaticPaths } from 'next'
import { Post, getPost, getPosts } from '@api/posts'

interface BlogPostProps {
  post: Post<'title' | 'content' | 'excerpt' | 'readingTime'>
}

const BlogPost = ({ post }: BlogPostProps): ReactElement => {
  // ...
}

export default BlogPost

export const getStaticProps: GetStaticProps = async ({
  params,
}) => {
  /*
    Here is the error:
    Properties 'slug' and 'lang' don't exist on type 'ParsedUrlQuery | undefined'
  */
  const { lang, slug } = params
  const post = getPost(
    slug,
    ['title', 'content', 'excerpt', 'readingTime'],
    lang
  )

  return {
    props: { post },
  }
}
```

Fort heureusement, si l'on examine les définitions des types `GetStaticProps` et `GetStaticPaths`, via notre IDE ou le [code source](https://github.com/vercel/next.js/blob/canary/packages/next/types/index.d.ts#L109), on se rend compte qu'il s'agit en fait de **types génériques**, que l'on peut donc étendre pour leur donner connaissance des spécificités de notre projet ! :man_dancing:

## Génériques !
Il ne reste donc plus qu'à définir une interface spécifique aux paramètres de requêtes de notre projet, qui étendra l'interface de base `ParsedUrlQuery`, fournie par Next.js...
```typescript
import type { ParsedUrlQuery } from 'querystring'
import type { Locale } from './i18n'

export interface QParams extends ParsedUrlQuery {
  slug?: string
  lang?: Locale
}
```

... que l'on ajoutera comme argument au type générique de notre fonction :

```typescript
import type { GetStaticProps, GetStaticPaths } from 'next'
import type { QParams } from '@typings/global'

import { Post, getPost, getPosts } from '@api/posts'

// ...

export const getStaticProps: GetStaticProps<BlogPostProps, QParams> = async ({ params }) => {
  // ...
}

export const getStaticPaths: GetStaticPaths<QParams> = async () => {
  // ...
}
```

Dans certains cas de paramètres de requêtes (comme pour ce site, utilisant un paramètre `lang` pour la gestion du multilingue), il est probable que le typage de votre fichier `_document.tsx` retourne lui aussi une erreur... Là encore, il suffira d'étendre l'interface initialement fournie par Next.js (`DocumentInitialProps`) :

```typescript
import type { DocumentInitialProps } from 'next/document'
import type { Locale } from './i18n'

export type MyDocumentProps = DocumentInitialProps & {
  lang: Locale
}
```

## :tada:
**Et voilà !** Si la solution se trouvait (comme souvent) dans le code source, on peut toutefois regretter que la documentation officielle ne fasse pas mention de cet usage, pourtant assez fréquent...

Quoi qu'il en soit, nous pouvons désormais adapter facilement nos typages aux besoins spécifiques de notre projet... Sans oublier la règle absolue que l'on oublie peut-être trop souvent : _read the f*** manual!_ :smile:
