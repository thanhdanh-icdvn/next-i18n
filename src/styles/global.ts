import { createGlobalStyle } from 'styled-components'

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 400;
    src: url(/fonts/Montserrat400.woff2) format('woff2');
    font-display: swap;
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  @font-face {
    font-family: 'Montserrat';
    font-style: normal;
    font-weight: 500;
    src: url(/fonts/Montserrat500.woff2) format('woff2');
    font-display: swap;
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  @font-face {
    font-family: 'Playfair Display';
    font-style: normal;
    font-weight: 500;
    src: url(/fonts/PlayfairDisplay500.woff2) format('woff2');
    font-display: swap;
    unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
  }

  html {
    font-size: ${({ theme }) => theme.typography.default.fontSize};
  }

  body {
    font-family: ${({ theme }) => theme.typography.default.fontFamily};
    font-weight: ${({ theme }) => theme.typography.default.fontWeight};
    background-color: ${({ theme }) => theme.colors.paper};
    color: ${({ theme }) => theme.colors.body};
  }

  ::selection {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.paper};
  }
`

export default GlobalStyle
