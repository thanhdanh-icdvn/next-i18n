import styled from 'styled-components'

export const MetaDataItem = styled.span`
  &:not(:first-child) {
    &:before {
      content: ' ･ ';
    }
  }
`
