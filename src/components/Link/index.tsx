import type {
  ReactElement,
  PropsWithChildren,
  MouseEvent,
  KeyboardEvent,
} from 'react'
import type { DefaultTheme } from 'styled-components'
import NextLink from 'next/link'

import { LinkInline } from './styles'

export interface LinkProps {
  href: string
  title?: string
  className?: string
  color?: keyof DefaultTheme['colors'] | 'inherit'
  onClick?: (e: MouseEvent | KeyboardEvent) => void
  isExternal?: boolean
  isInline?: boolean
  ariaLabel?: string
}

const Link = ({
  href,
  title,
  children,
  className,
  color,
  onClick,
  isExternal = false,
  isInline = false,
  ariaLabel,
}: PropsWithChildren<LinkProps>): ReactElement => {
  const Component = isInline ? LinkInline : 'a'

  return (
    <NextLink href={href} passHref>
      <Component
        title={title}
        role="link"
        tabIndex={0}
        onClick={onClick}
        onKeyPress={onClick}
        color={color}
        className={className}
        aria-label={ariaLabel}
        {...((isExternal || href.startsWith('http')) && {
          target: '_blank',
          rel: 'noopener noreferrer',
        })}
      >
        {children}
      </Component>
    </NextLink>
  )
}

export default Link
