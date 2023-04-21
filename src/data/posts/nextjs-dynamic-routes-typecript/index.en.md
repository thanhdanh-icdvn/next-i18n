---
title: "Next.js dynamic routes & Typescript"
excerpt: "How to avoid type errors when using dynamic routes on Next.js"
date: '2021-06-11'
---

_Next.js' routing system, based on the `pages` folder structure, is simple and powerful. It also allows us to create dynamic routes, based on_ query params _(eg blog posts)._

_In this context, and using Typescript with types provided by Next.js, we end up though with a typing error when using the [data fetching](https://nextjs.org/docs/basic-features/data-fetching) (`getStaticProps` or `getServerSideProps`) methods made available by the framework_ :confounded:.

_How to solve this problem? Documentation is unfortunately not very explicit on this use case, and yet the solution is quite simple!_

> Based on a Next.js project, we will see how to adapt data fetching functions types, and thus avoid any error such as:
```
Property 'slug' does not exist on type 'ParsedUrlQuery | undefined'
```

## Prerequisites
1. [Node.js](https://nodejs.org/en/) (>= 10.13)
2. A Next.js project (existing one or generated through [`npx create-next-app`](https://nextjs.org/docs/getting-started#setup)) with Typescript

__This website was the starting point for this article, so do not hesitate to refer to its [source code](https://gitlab.com/soykje/soykje.gitlab.io/-/tree/master) for more details!__

## Next.js types
Next.js provides specific functions for data fetching, whether we're using static generation (SSG) or server side (SSR).

Let's see here the case of static generation, with the `getStaticProps` and `getStaticPaths` functions (the logic is similar for the `getServerSideProps` method).

As the [documentation](https://nextjs.org/docs/basic-features/data-fetching#typescript-use-getstaticprops) says, Next.js provides dedicated types for each of these functions. However in the case of dynamic routes, the use of the type _as indicated_ is not enough:
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

Fortunately, if we look at the types definitions for `GetStaticProps` and `GetStaticPaths`, via our IDE or the [source code](https://github.com/vercel/next.js/blob/canary/packages/next/types/index.d.ts#L109), we realize that they are in fact **generic types**, which we can therefore extend to make them aware of the specificities of our project! :man_dancing:

## Generics !
All that remains is to define a specific interface for the query parameters of our project, which will extend the basic `ParsedUrlQuery` interface provided by Next.js ...
```typescript
import type { ParsedUrlQuery } from 'querystring'
import type { Locale } from './i18n'

export interface QParams extends ParsedUrlQuery {
  slug?: string
  lang?: Locale
}
```

... that we'll add as an argument to the generic type of our function:
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

With some kinds of query parameters (like for this site, using a `lang` parameter for multilingual support), your `_document.tsx` file may also return a typing error... Here again, we'll just need to  extend the interface initially provided by Next.js (`DocumentInitialProps`):

```typescript
import type { DocumentInitialProps } from 'next/document'
import type { Locale } from './i18n'

export type MyDocumentProps = DocumentInitialProps & {
  lang: Locale
}
```

## :tada:
**Et voilà !** If the solution was (as often) in the source code, we can however regret that the official documentation does not mention this use case, however quite frequent...

Anyway, we can now easily adapt our typings to the specific needs of our project... Without forgetting the absolute rule that we perhaps forget too often: _read the f*** manual!_ :smile:
