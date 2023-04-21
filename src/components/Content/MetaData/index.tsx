import type { ReactElement } from 'react'
import type { TextColor } from '@components/Content/Text/types'
import type { MetaContent } from './types'

import { Text } from '@components/Content'
import { MetaDataItem } from './styles'

interface MetaDataProps {
  content: MetaContent[]
  color?: TextColor
  className?: string
}

const MetaData = ({
  content,
  color = 'muted',
  className,
}: MetaDataProps): ReactElement => (
  <Text variant="body2" color={color} className={className}>
    {content
      .filter((c) => c.label)
      .map((item) => (
        <MetaDataItem key={item.label} {...(item.title && { title: item.title })}>
          {item.label}
        </MetaDataItem>
      ))}
  </Text>
)

export default MetaData
