import { DefaultTheme, createGlobalStyle } from 'styled-components'

const base: Omit<DefaultTheme, 'colors'> = {
  layout: {
    breakpoints: {
      sm: 576,
      md: 768,
      lg: 992,
      xl: 1200,
    },
    gutter: '2rem',
  },
  typography: {
    default: {
      fontFamily: 'Arial, sans-serif',
      fontWeight: 400,
      fontSize: '18px',
      lineHeight: 1.5,
    },
    body1: {
      fontFamily: "'Montserrat'",
      fontWeight: 400,
      fontWeightBold: 500,
      fontSize: {
        _: '1rem',
        md: '1rem',
      },
      lineHeight: 1.5,
    },
    body2: {
      fontFamily: "'Montserrat'",
      fontWeight: 400,
      fontWeightBold: 500,
      fontSize: {
        _: '0.75rem',
        md: '0.75rem',
      },
      lineHeight: 1.25,
    },
    code: {
      fontFamily: 'Monaco, Consolas, monospace',
      fontWeight: 400,
      fontSize: {
        _: '0.75rem',
        md: '0.75rem',
      },
      lineHeight: 1.5,
    },
    title1: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 500,
      fontSize: {
        _: '3.5rem',
        sm: '6rem',
        md: '8rem',
      },
      lineHeight: 1.1,
    },
    title2: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 500,
      fontSize: {
        _: '2.5rem',
        md: '3.5rem',
      },
      lineHeight: 1.1,
    },
    title3: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 500,
      fontSize: {
        _: '2.125rem',
        md: '2.5rem',
      },
      lineHeight: 1.1,
    },
    title4: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 500,
      fontSize: {
        _: '1.75rem',
        md: '2rem',
      },
      lineHeight: 1.1,
    },
    title5: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 500,
      fontSize: {
        _: '1.5rem',
        md: '1.5rem',
      },
      lineHeight: 1.25,
    },
    title6: {
      fontFamily: "'Playfair Display', Georgia, serif",
      fontWeight: 500,
      fontSize: {
        _: '1.25rem',
        md: '1.25rem',
      },
      lineHeight: 1.5,
    },
  },
  sizes: {
    xs: '1rem',
    sm: '1.5555rem',
    md: '2rem',
    lg: '3rem',
    xl: '4rem',
  },
}

export const theme: DefaultTheme = {
  ...base,
  colors: {
    primary: 'var(--color-primary)',
    alert: 'var(--color-alert)',
    body: 'var(--color-body)',
    muted: 'var(--color-muted)',
    hint: 'var(--color-hint)',
    border: 'var(--color-border)',
    paper: 'var(--color-paper)',
  },
}

export const ThemeGlobals = createGlobalStyle`
  :root {
    --color-primary: #f0695f;
    --color-alert: #e5a340;
    --color-body: #3c3c3c;
    --color-muted: #787373;
    --color-hint: #969696;
    --color-border: #dcdcdc;
    --color-paper: #ffffff;
  }

  [data-theme='dark'] {
    --color-primary: #f0695f;
    --color-alert: #e5a340;
    --color-body: #d2d2d2;
    --color-muted: #afafaf;
    --color-hint: #6e6e6e;
    --color-border: #323232;
    --color-paper: #141414;
  }
`
