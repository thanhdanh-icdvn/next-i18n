import { remark } from 'remark'
import gemoji from 'remark-gemoji'

export const transformEmoji = (str: string): string =>
  remark().use(gemoji).processSync(str).toString()
