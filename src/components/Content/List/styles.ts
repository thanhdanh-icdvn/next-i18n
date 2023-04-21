import styled from 'styled-components'

import Text from '../Text'

export const ListBase = styled(Text)`
  padding-left: 2em;

  &:not(:first-child) {
    margin-top: 1em;
  }
  &:not(:last-child) {
    margin-bottom: 1em;
  }

  li:not(:first-child) {
    margin-top: 0.5em;
  }
`
