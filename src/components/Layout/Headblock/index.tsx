import type { FC } from 'react'

import Container from '@components/Layout/Container'

import { HeadblockBase } from './styles'

const Headblock: FC = ({ children }) => (
  <HeadblockBase>
    <Container size="lg">{children}</Container>
  </HeadblockBase>
)

export default Headblock
