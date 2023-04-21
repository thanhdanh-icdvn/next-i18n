import type { MetaContent } from '@components/Content/MetaData/types'
import type { ReactElement } from 'react'

import { CardBase, CardBody, CardMetaData, CardTitle } from './styles'

interface CardProps {
  title: string
  body?: string
  href: string
  metas?: MetaContent[]
  variant?: 'normal' | 'compact'
}

const Card = ({
  title,
  body,
  href,
  metas,
  variant = 'normal',
}: CardProps): ReactElement => {
  const isCompact = variant === 'compact'

  return (
    <article>
      <CardBase href={href} isCompact={isCompact}>
        <CardTitle
          variant={isCompact ? 'title5' : 'title4'}
          component="h3"
          color={isCompact ? 'body' : 'primary'}
        >
          {title}
        </CardTitle>

        {body && <CardBody variant={isCompact ? 'body2' : 'body1'}>{body}</CardBody>}

        {metas && <CardMetaData content={metas} />}
      </CardBase>
    </article>
  )
}

export default Card
