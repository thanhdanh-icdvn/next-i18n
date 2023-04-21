import type { ReactElement, PropsWithChildren } from 'react'
import { DefaultTheme } from 'styled-components'

import { ContainerBase } from './styles'

export interface ContainerProps {
  size?: keyof DefaultTheme['layout']['breakpoints']
  className?: string
}

const Container = ({
  children,
  size = 'md',
  className,
}: PropsWithChildren<ContainerProps>): ReactElement => (
  <ContainerBase size={size} className={className}>
    {children}
  </ContainerBase>
)

export default Container
