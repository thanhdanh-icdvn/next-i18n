import styled from 'styled-components'

import { Text } from '@components/Content'
import NavBarButton from '../../components/NavBarButton'

export const LanguageSelectorButton = styled(NavBarButton)`
  margin-right: ${({ theme }) => theme.sizes.xs};
`

export const LanguageSelectorLabel = styled(Text).attrs({
  color: 'inherit',
})`
  text-transform: uppercase;
`
