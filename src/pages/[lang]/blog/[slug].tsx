import type { ReactElement } from 'react'
import type { GetStaticProps, GetStaticPaths } from 'next'
import type { QParams } from '@typings/global'

import ReactMarkdown from 'react-markdown'
import gemoji from 'remark-gemoji'

import { Post, getPosts, getPost } from '@api/posts'

import { useLocale } from '@i18n/context'
import { LOCALES, DEFAULT_LOCALE } from '@i18n/constants'

import { timeAgo, localeDate } from '@utils/datetime'

import Seo from '@components/Seo'
import { Page, Container, Banner, Footnote } from '@components/Layout'
import {
  BlockQuote,
  Code,
  CodeBlock,
  Divider,
  List,
  Text,
} from '@components/Content'
import type { TextProps } from '@components/Content/Text'
import type { CodeBlockProps } from '@components/Content/CodeBlock'

import Link from '@components/Link'

interface BlogPostProps {
  post: Post<'title' | 'content' | 'excerpt' | 'readingTime'>
}

const BlogPost = ({ post }: BlogPostProps): ReactElement => {
  const { t, lang } = useLocale()

  return (
    <Page>
      <Seo
        title={post.title}
        description={post.excerpt}
        pathname={`${lang}/blog/${post.slug}`}
      />

      <article>
        <Banner
          title={post.title}
          metas={[
            {
              label: timeAgo(post.date, lang, { prefix: t('common.published') }),
              title: localeDate(post.date, lang),
            },
            { label: post.readingTime },
          ]}
        />

        <Container>
          <ReactMarkdown
            remarkPlugins={[gemoji]}
            disallowedElements={['pre']}
            unwrapDisallowed
            components={{
              /* eslint-disable @typescript-eslint/no-unused-vars */
              h1: ({ children }) => (
                <Text variant="title1" color="primary">
                  {children}
                </Text>
              ),
              h2: ({ children }) => (
                <Text variant="title2" color="primary">
                  {children}
                </Text>
              ),
              h3: ({ children }) => (
                <Text variant="title3" color="primary">
                  {children}
                </Text>
              ),
              h4: ({ children }) => (
                <Text variant="title4" color="primary">
                  {children}
                </Text>
              ),
              h5: ({ children }) => (
                <Text variant="title5" color="primary">
                  {children}
                </Text>
              ),
              h6: ({ children }) => (
                <Text variant="title6" color="primary">
                  {children}
                </Text>
              ),
              p: ({ node, ...props }) => (
                <Text {...(props as unknown as TextProps)} />
              ),
              strong: ({ children }) => <Text component="strong">{children}</Text>,
              blockquote: ({ children }) => (
                <BlockQuote>{children.filter((n) => n !== '\n')}</BlockQuote>
              ),
              a: ({ children, href }) => (
                <Link isInline href={`${href}`}>
                  {children}
                </Link>
              ),
              hr: () => <Divider variant="dots" color="hint" />,
              ol: ({ children }) => <List isOrdered>{children}</List>,
              ul: ({ children }) => <List>{children}</List>,
              code: ({ children, className, inline }) =>
                inline ? (
                  <Code>{children}</Code>
                ) : (
                  <CodeBlock
                    language={
                      /language-(\w+)/.exec(
                        className || ''
                      )?.[1] as CodeBlockProps['language']
                    }
                    value={String(children).replace(/\n$/, '')}
                  />
                ),
              /* eslint-enable @typescript-eslint/no-unused-vars */
            }}
          >
            {post.content}
          </ReactMarkdown>
        </Container>

        <Footnote lang={lang} slug={post.slug} />
      </article>
    </Page>
  )
}

export default BlogPost

export const getStaticProps: GetStaticProps<BlogPostProps, QParams> = async ({
  params,
}) => {
  const lang = params?.lang || DEFAULT_LOCALE
  const post = getPost(
    params?.slug as string,
    ['title', 'content', 'excerpt', 'readingTime'],
    lang
  )

  // Returns 404 if translated post is unavailable
  if (!post) return { notFound: true }

  return {
    props: { post },
  }
}

export const getStaticPaths: GetStaticPaths<QParams> = async () => {
  const posts = getPosts()

  return {
    paths: posts.flatMap((post) =>
      LOCALES.flatMap((lang) => ({
        params: {
          slug: post.slug,
          lang,
        },
      }))
    ),
    fallback: false,
  }
}
