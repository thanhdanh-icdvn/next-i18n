import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'
import { readingTime } from '@utils/datetime'
import { DEFAULT_LOCALE } from '@i18n/constants'

const POSTS_DIR = join(process.cwd(), 'src/data/posts')

type PostKeys = 'title' | 'date' | 'content' | 'excerpt' | 'readingTime' | 'slug'

export type Post<Key extends PostKeys> = {
  slug: string
  date: string
} & {
  [K in Key]: string
}

export const getPost = <F extends PostKeys>(
  slug: string,
  fields: F[] = [],
  lang: string = DEFAULT_LOCALE
): Post<F> | null => {
  const fileName = `index.${lang}.md`
  const filePath = join(POSTS_DIR, slug, fileName)
  const files = fs.readdirSync(join(POSTS_DIR, slug))

  // null if translated post is not available
  if (!files.includes(fileName)) return null

  const fileContent = fs.readFileSync(filePath, 'utf8')
  const { data, content } = matter(fileContent)

  return fields.reduce(
    (o, k) => {
      if (k === 'content') {
        return { ...o, [k]: content }
      } else if (k === 'readingTime') {
        return { ...o, [k]: readingTime(content) }
      } else {
        return { ...o, [k]: data[k] }
      }
    },
    { slug: slug, date: data.date as string }
  ) as Post<F>
}

export const getPosts = <F extends PostKeys>(
  fields: F[] = [],
  lang: string = DEFAULT_LOCALE
): Post<F>[] => {
  const slugs = fs.readdirSync(POSTS_DIR)

  // Filter unavailable posts then sort by date (ASC)
  const posts = slugs
    .map((slug) => getPost(slug, fields, lang))
    .filter((p) => p !== null)
    .sort((p1, p2) =>
      (p1 as Post<F>).date > (p2 as Post<F>).date ? -1 : 1
    ) as Post<F>[]

  return posts
}
