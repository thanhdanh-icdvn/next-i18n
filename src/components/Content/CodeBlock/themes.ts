import type { PrismTheme } from 'prism-react-renderer'
import vsDark from 'prism-react-renderer/themes/vsDark'

export const editorTheme: PrismTheme = {
  ...vsDark,
  plain: {
    color: '#bfc7d5',
    backgroundColor: '#282828',
  },
}
