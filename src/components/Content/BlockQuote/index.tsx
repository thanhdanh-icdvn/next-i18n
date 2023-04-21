import {
  ReactElement,
  PropsWithChildren,
  Children,
  cloneElement,
  isValidElement,
} from 'react'
import type { DefaultTheme } from 'styled-components'
import Text, { TextProps } from '../Text'

import { BlockQuoteBase } from './styles'

interface BlockQuoteProps {
  color?: keyof DefaultTheme['colors']
}

const BlockQuote = ({
  children,
  color = 'primary',
}: PropsWithChildren<BlockQuoteProps>): ReactElement => {
  const childTextProps: TextProps = {
    variant: 'title6',
    component: 'p',
    color,
  }

  const wrappedChildren = Children.map(children, (child) => {
    return isValidElement(child) ? (
      cloneElement(child, childTextProps)
    ) : (
      <Text {...childTextProps}>{child}</Text>
    )
  })

  return <BlockQuoteBase>{wrappedChildren}</BlockQuoteBase>
}

export default BlockQuote
