import type { FC } from 'react'

import Container from '@components/Layout/Container'
import { BlockQuote } from '@components/Content'

import { HeadlineBase } from './styles'

const Headline: FC = ({ children }) => (
  <HeadlineBase>
    <Container>
      <BlockQuote color="hint">{children}</BlockQuote>
    </Container>
  </HeadlineBase>
)

export default Headline
