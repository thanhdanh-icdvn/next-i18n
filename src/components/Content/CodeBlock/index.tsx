import type { ReactElement } from 'react'

import Prism from 'prismjs'
import Highlight, { Prism as PrismRR, Language } from 'prism-react-renderer'

import { editorTheme } from './themes'
import { Pre, Line, LineNo, LineContent } from './styles'

export interface CodeBlockProps {
  value: string
  language?: Language
}

// Workaround for typing mismatches when using Prism manual import (with types from DT)
// See https://github.com/FormidableLabs/prism-react-renderer/issues/116
type PrismLib = typeof PrismRR & typeof Prism

const CodeBlock = ({ value, language = 'bash' }: CodeBlockProps): ReactElement => {
  return (
    <Highlight
      Prism={Prism as PrismLib}
      theme={editorTheme}
      code={value}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <Pre className={className} style={style}>
          {tokens.map((line, i) => (
            <Line key={`${line}`} {...getLineProps({ line, key: i })}>
              <LineNo>{i + 1}</LineNo>
              <LineContent>
                {line.map((token, key) => (
                  <span key={`${token}`} {...getTokenProps({ token, key })} />
                ))}
              </LineContent>
            </Line>
          ))}
        </Pre>
      )}
    </Highlight>
  )
}

export default CodeBlock
