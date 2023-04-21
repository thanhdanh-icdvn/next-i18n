import { createGlobalStyle } from 'styled-components'

const ResetStyle = createGlobalStyle`
  html {
    height: 100%;
    box-sizing: border-box;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  body { min-height: 100%; }

  html,
  body,
  p,
  ol,
  ul,
  li,
  dl,
  dt,
  dd,
  figure,
  figcaption,
  blockquote,
  fieldset,
  legend,
  textarea,
  pre,
  iframe,
  hr,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
    padding: 0;
  }

  ul { list-style-type: disc; }

  a {
    -webkit-tap-highlight-color: transparent;
    background-color: transparent;
  }

  img,
  video {
    vertical-align: middle;
    height: auto;
    max-width: 100%;
  }

  pre,
  code {
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    font-size: 1em;
    line-height: 1.5;
    text-align: left;
    tab-size: 4;
  }

  pre {
    display: block;
    overflow: auto;
    white-space: pre-wrap;
    word-wrap: normal;

    code {
      font-size: 1em;
      color: inherit;
      word-break: normal;
    }
  }

  code { word-wrap: break-word; }
`

export default ResetStyle
