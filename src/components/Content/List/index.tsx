import type { ReactElement, PropsWithChildren } from 'react'

import { ListBase } from './styles'

interface ListProps {
  isOrdered?: boolean
  className?: string
}

const List = ({
  isOrdered = false,
  children,
  className,
}: PropsWithChildren<ListProps>): ReactElement => (
  <ListBase component={isOrdered ? 'ol' : 'ul'} className={className}>
    {children}
  </ListBase>
)

export default List
