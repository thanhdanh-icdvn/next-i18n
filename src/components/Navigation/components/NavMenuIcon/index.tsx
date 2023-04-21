import type { ReactElement } from 'react'

import { NavMenuIconBase } from './styles'

export interface NavMenuIconProps {
  onClick: () => void
  isActive?: boolean
  className?: string
}

const NavMenuIcon = ({
  onClick,
  className,
  isActive = false,
}: NavMenuIconProps): ReactElement => (
  <NavMenuIconBase
    type="button"
    isActive={isActive}
    onClick={onClick}
    className={className}
    aria-label="Menu"
  >
    <span>{isActive ? 'Close menu' : 'Open menu'}</span>
  </NavMenuIconBase>
)

export default NavMenuIcon
