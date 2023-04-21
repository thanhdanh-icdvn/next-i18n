import type { ReactElement } from 'react'
import type { Locale } from '@typings/i18n'

import { Twitter, Gitlab } from '@styled-icons/fa-brands'

import { Container } from '@components/Layout'
import { Icon } from '@components/Content'

import { FootnoteBase, FootnoteContent, FootnoteContentLink } from './styles'

interface Props {
  lang: Locale
  slug: string
}

const Footnote = ({ lang, slug }: Props): ReactElement => (
  <FootnoteBase>
    <Container>
      <FootnoteContent>
        <FootnoteContentLink
          href={`https://mobile.twitter.com/search?q=${process.env.NEXT_PUBLIC_SITE_URL}/${lang}/blog/${slug}`}
          ariaLabel="Discuss on Twitter"
          title="Discuss on Twitter"
        >
          <Icon as={Twitter} size="xs" wrapper="sm" />
        </FootnoteContentLink>

        <FootnoteContentLink
          href={`https://gitlab.com/soykje/soykje.gitlab.io/-/blob/master/src/data/posts/${slug}/index.${lang}.md`}
          ariaLabel="Edit on Gitlab"
          title="Edit on Gitlab"
        >
          <Icon as={Gitlab} size="xs" wrapper="sm" />
        </FootnoteContentLink>
      </FootnoteContent>
    </Container>
  </FootnoteBase>
)

export default Footnote
