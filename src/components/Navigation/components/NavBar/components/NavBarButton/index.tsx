import type { ReactElement, PropsWithChildren, MouseEvent } from 'react'

import { NavBarButtonBase } from './styles'

export interface NavBarButtonProps {
  onClick: (e: MouseEvent) => void
  title?: string
  ariaLabel?: string
  className?: string
}

const NavBarButton = ({
  onClick,
  title,
  ariaLabel,
  children,
  className,
}: PropsWithChildren<NavBarButtonProps>): ReactElement => (
  <NavBarButtonBase
    type="button"
    onClick={onClick}
    title={title}
    aria-label={ariaLabel}
    className={className}
  >
    {children}
  </NavBarButtonBase>
)

export default NavBarButton
