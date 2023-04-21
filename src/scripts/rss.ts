import fs from 'fs'
import { Feed } from 'feed'
import { remark } from 'remark'
import html from 'remark-html'
import gemoji from 'remark-gemoji'

import { LOCALES } from '@i18n/constants'
import { getPosts } from '@api/posts'
import { getI18n, I18n } from '@api/i18n'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL as string
const AUTHOR_NAME = process.env.NEXT_PUBLIC_SITE_NAME as string
const TWITTER_USERNAME = process.env.NEXT_PUBLIC_TWITTER_USERNAME as string

const markdownToHtml = (markdown: string): string =>
  remark().use(html).use(gemoji).processSync(markdown).toString()

const generateRssFeed = (): void => {
  const author = {
    name: AUTHOR_NAME,
    link: `https://twitter.com/${TWITTER_USERNAME}`,
  }

  LOCALES.forEach((lang) => {
    const { description } = getI18n(lang, 'blog').blog as I18n

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // https://github.com/jpmonette/feed/issues/138
    const feed = new Feed({
      title: AUTHOR_NAME,
      description: description as string,
      id: `${SITE_URL}/${lang}`,
      link: `${SITE_URL}/${lang}`,
      language: lang,
      generator: 'Next.js & Feed',
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
