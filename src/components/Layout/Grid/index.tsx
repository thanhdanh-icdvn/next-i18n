import { ReactElement, PropsWithChildren } from 'react'

import { GridBase } from './styles'

export interface GridProps {
  columns: number
  gutter: boolean
}

const Grid = ({
  columns = 1,
  gutter = false,
  children,
}: PropsWithChildren<GridProps>): ReactElement => (
  <GridBase columns={columns} gutter={gutter}>
    {children}
  </GridBase>
)

export default Grid
