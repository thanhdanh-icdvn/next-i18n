import type { ReactElement, MouseEvent } from 'react'

import { Icon } from '@components/Content'
import { Language } from '@styled-icons/ionicons-sharp'

import { ButtonBase } from './styles'

export interface ButtonProps {
  onClick: (e: MouseEvent) => void
  title?: string
}

const Button = ({ title, onClick }: ButtonProps): ReactElement => (
  <ButtonBase type="button" onClick={onClick} title={title}>
    <Icon as={Language} size="xs" wrapper="sm" />
  </ButtonBase>
)

export default Button
