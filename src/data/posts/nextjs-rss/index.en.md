---
title: "Next.js (SSG) & RSS feed"
excerpt: "Adding an RSS feed to a Next.js project (SSG)"
date: "2021-02-10"
---

_With the proliferation of online content, access to information can sometimes be more time-consuming than one would like... Whether it is about general or more targeted news, there is however a simple way to facilitate daily digest: [RSS feeds](https://en.wikipedia.org/wiki/RSS)._

_So why not set one up on your (static) website, and thus gain visibility?_

> Based on a Next.js project (SSG), we will see how to easily add an RSS feed for Markdown-based content.

## Prerequisites
1. [Node.js](https://nodejs.org/en/) (>= 10.13)
2. A Next.js project (existing one or generated through [`npx create-next-app`](https://nextjs.org/docs/getting-started#setup))

__This website was the starting point for this article, so do not hesitate to refer to its [source code](https://gitlab.com/soykje/soykje.gitlab.io/-/tree/master) for more details!__

## Generate the RSS feed
While it is quite possible to generate the stream file(s) completely manually, it is not necessary to reinvent the wheel! :man-cartwheeling: Here we will rely on the [`feed`](https://github.com/jpmonette/feed) package, which will simplify the writing of our feed generation function:

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

The code is split into two quite simple parts: first we generate the flow with its general information, then we loop through our content (posts) to generate our items.

The whole is then written into an `.xml` file, in RSS 2.0 format. Several formats are possible, however its excellent support makes the addition of other formats often superfluous.

Our content here is written using Markdown syntax. By relying on the [`remark`](https://github.com/remarkjs/remark) ecosystem, we can easily add to our feed items the (exhaustive) content of our articles, converted to `HTML`. This is often a recommended practice, although not necessary.

Finally, in the [case of a multilingual site](https://gitlab.com/soykje/soykje.gitlab.io/-/blob/master/src/scripts/rss.js#L24), we'll just have to adapt the code, to generate as many files as supported languages.

## Helping robots
To make life easier for browsers and other indexing robots, and to help them find our RSS feed, we should remember to add a link to it in the `<head />` of our document:

```jsx
<link
  rel="alternate"
  type="application/rss+xml"
  title={`${AUTHOR_NAME}'s blog feed`}
  href="/feed.xml"
/>
```

## Updating the _build_ script
Now that everything is in place, we still have to call this function. In the context of a _SSG_ site, this call will be made, _logically_, during the _build_ phase.

Our RSS script uses ES modules (ESM), to allow the import of functions used elsewhere in the project (such as content fetching). To use it in _CLI_, we need first to adapt our _Webpack_ configuration via the `next.config.js` file:

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

Our script will thus be compiled by Webpack in the `.next/server` folder. All that remains is to call it via another script from our `package.json` file, which will take care of generating our RSS feed:

```json
"scripts": {
  // ...
  "build": "next build && npm run rss:generate",
  "rss:generate": "node ./.next/server/scripts/rss-generate"
}
```

## :tada:
**Et voilà !** Adding an RSS feed is a real plus for a website (especially a blog or other news site), allowing users to follow our content in a simple way, without having to juggle multiple tabs... It's also a good way to improve our visibility online, so why deprive yourself? :slightly_smiling_face:
