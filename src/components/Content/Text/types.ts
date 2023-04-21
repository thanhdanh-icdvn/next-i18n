import { DefaultTheme } from 'styled-components'

export type TextVariant =
  | keyof Omit<DefaultTheme['typography'], 'default' | 'code'>
  | 'inherit'
export type TextColor = keyof DefaultTheme['colors'] | 'inherit'

export type HTMLElementTagName = keyof HTMLElementTagNameMap
