import type { ReactElement, PropsWithChildren } from 'react'
import type { TextVariant, TextColor, HTMLElementTagName } from './types'

import { TextVariantMap } from './constants'

import { TextBase } from './styles'

export interface TextProps {
  component?: HTMLElementTagName
  variant?: TextVariant
  color?: TextColor
  className?: string
  [rest: string]: unknown
}

const Text = ({
  variant = 'body1',
  component,
  color = 'body',
  children,
  className,
  ...rest
}: PropsWithChildren<TextProps>): ReactElement => {
  return (
    <TextBase
      as={component || TextVariantMap[variant]}
      variant={variant}
      textColor={color}
      className={className}
      {...rest}
    >
      {children}
    </TextBase>
  )
}

export default Text
