import 'styled-components'

interface Typography {
  fontFamily: string
  fontWeight: number
  fontWeightBold?: number
  fontSize: {
    _: string
    md: string
    sm?: string
  }
  lineHeight: number
}

declare module 'styled-components' {
  export interface DefaultTheme {
    layout: {
      breakpoints: {
        sm: number
        md: number
        lg: number
        xl: number
      }
      gutter: string
    }
    typography: {
      default: Omit<Typography, 'fontSize'> & { fontSize: string }
      body1: Typography
      body2: Typography
      code: Typography
      title1: Typography
      title2: Typography
      title3: Typography
      title4: Typography
      title5: Typography
      title6: Typography
    }
    sizes: {
      xs: string
      sm: string
      md: string
      lg: string
      xl: string
    }
    colors: {
      primary: string
      alert: string
      body: string
      muted: string
      hint: string
      border: string
      paper: string
    }
  }
}
