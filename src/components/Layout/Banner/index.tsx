import type { ReactElement } from 'react'

import { MetaData } from '@components/Content'
import type { MetaContent } from '@components/Content/MetaData/types'
import type { TextColor } from '@components/Content/Text/types'

import Container from '../Container'

import { BannerBase, BannerTitle } from './styles'

interface BannerProps {
  title: string
  metas?: MetaContent[]
  color?: TextColor
}

const Banner = ({ title, metas, color = 'primary' }: BannerProps): ReactElement => (
  <BannerBase>
    <Container size="lg">
      <BannerTitle variant="title1" color={color}>
        {title}
      </BannerTitle>

      {metas && <MetaData content={metas} />}
    </Container>
  </BannerBase>
)

export default Banner
