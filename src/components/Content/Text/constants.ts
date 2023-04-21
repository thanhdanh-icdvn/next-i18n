import type { TextVariant, HTMLElementTagName } from './types'

export const TextVariantMap: Record<TextVariant, HTMLElementTagName> = {
  title1: 'h1',
  title2: 'h2',
  title3: 'h3',
  title4: 'h4',
  title5: 'h5',
  title6: 'h6',
  body1: 'p',
  body2: 'p',
  inherit: 'div',
}
