// lib/pdf/fonts/register.ts
// Font registration for React-PDF using Google Fonts CDN

import { Font } from '@react-pdf/renderer'

// Track if fonts are already registered
let fontsRegistered = false

/**
 * Register custom fonts for PDF rendering
 *
 * We use Google Fonts gstatic CDN URLs which are reliable and fast.
 * These URLs are extracted from fonts.googleapis.com CSS responses.
 */
export function registerFonts(): void {
  if (fontsRegistered) return
  fontsRegistered = true

  // Inter - Modern Sans-Serif
  Font.register({
    family: 'Inter',
    fonts: [
      { src: 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf', fontWeight: 400 },
      { src: 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fMZg.ttf', fontWeight: 500 },
      { src: 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYMZg.ttf', fontWeight: 600 },
      { src: 'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf', fontWeight: 700 },
    ],
  })

  // Roboto - Clean Sans-Serif
  Font.register({
    family: 'Roboto',
    fonts: [
      { src: 'https://fonts.gstatic.com/s/roboto/v50/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWubEbWmT.ttf', fontWeight: 400 },
      { src: 'https://fonts.gstatic.com/s/roboto/v50/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWub2bWmT.ttf', fontWeight: 500 },
      { src: 'https://fonts.gstatic.com/s/roboto/v50/KFOMCnqEu92Fr1ME7kSn66aGLdTylUAMQXC89YmC2DPNWuYjammT.ttf', fontWeight: 700 },
    ],
  })

  // Open Sans - Friendly Sans-Serif
  Font.register({
    family: 'Open Sans',
    fonts: [
      { src: 'https://fonts.gstatic.com/s/opensans/v44/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsjZ0C4n.ttf', fontWeight: 400 },
      { src: 'https://fonts.gstatic.com/s/opensans/v44/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsgH1y4n.ttf', fontWeight: 600 },
      { src: 'https://fonts.gstatic.com/s/opensans/v44/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVZyOOSr4dVJWUgsg-1y4n.ttf', fontWeight: 700 },
    ],
  })

  // Lato - Humanist Sans-Serif
  Font.register({
    family: 'Lato',
    fonts: [
      { src: 'https://fonts.gstatic.com/s/lato/v25/S6uyw4BMUTPHvxk.ttf', fontWeight: 400 },
      { src: 'https://fonts.gstatic.com/s/lato/v25/S6u9w4BMUTPHh6UVew8.ttf', fontWeight: 700 },
    ],
  })

  // Merriweather - Elegant Serif
  Font.register({
    family: 'Merriweather',
    fonts: [
      { src: 'https://fonts.gstatic.com/s/merriweather/v33/u-4D0qyriQwlOrhSvowK_l5UcA6zuSYEqOzpPe3HOZJ5eX1WtLaQwmYiScCmDxhtNOKl8yDr3icqEw.ttf', fontWeight: 400 },
      { src: 'https://fonts.gstatic.com/s/merriweather/v33/u-4D0qyriQwlOrhSvowK_l5UcA6zuSYEqOzpPe3HOZJ5eX1WtLaQwmYiScCmDxhtNOKl8yDrOSAqEw.ttf', fontWeight: 700 },
    ],
  })

  // Source Sans 3 - Professional Sans-Serif (replaces Source Sans Pro)
  Font.register({
    family: 'Source Sans Pro',
    fonts: [
      { src: 'https://fonts.gstatic.com/s/sourcesans3/v19/nwpBtKy2OAdR1K-IwhWudF-R9QMylBJAV3Bo8Ky461EN.ttf', fontWeight: 400 },
      { src: 'https://fonts.gstatic.com/s/sourcesans3/v19/nwpBtKy2OAdR1K-IwhWudF-R9QMylBJAV3Bo8Kxm7FEN.ttf', fontWeight: 600 },
      { src: 'https://fonts.gstatic.com/s/sourcesans3/v19/nwpBtKy2OAdR1K-IwhWudF-R9QMylBJAV3Bo8Kxf7FEN.ttf', fontWeight: 700 },
    ],
  })

  // Oswald - Condensed Sans (Good for headers)
  Font.register({
    family: 'Oswald',
    fonts: [
      { src: 'https://fonts.gstatic.com/s/oswald/v57/TK3_WkUHHAIjg75cFRf3bXL8LICs1_FvgUE.ttf', fontWeight: 400 },
      { src: 'https://fonts.gstatic.com/s/oswald/v57/TK3_WkUHHAIjg75cFRf3bXL8LICs18NvgUE.ttf', fontWeight: 500 },
      { src: 'https://fonts.gstatic.com/s/oswald/v57/TK3_WkUHHAIjg75cFRf3bXL8LICs1xZogUE.ttf', fontWeight: 700 },
    ],
  })

  // Raleway - Elegant Sans
  Font.register({
    family: 'Raleway',
    fonts: [
      { src: 'https://fonts.gstatic.com/s/raleway/v37/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVvaooCP.ttf', fontWeight: 400 },
      { src: 'https://fonts.gstatic.com/s/raleway/v37/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVvoooCP.ttf', fontWeight: 500 },
      { src: 'https://fonts.gstatic.com/s/raleway/v37/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVsEpYCP.ttf', fontWeight: 600 },
      { src: 'https://fonts.gstatic.com/s/raleway/v37/1Ptxg8zYS_SKggPN4iEgvnHyvveLxVs9pYCP.ttf', fontWeight: 700 },
    ],
  })

  // EB Garamond - Classic Serif
  Font.register({
    family: 'EB Garamond',
    fonts: [
      { src: 'https://fonts.gstatic.com/s/ebgaramond/v32/SlGDmQSNjdsmc35JDF1K5E55YMjF_7DPuGi-6_RUAw.ttf', fontWeight: 400 },
      { src: 'https://fonts.gstatic.com/s/ebgaramond/v32/SlGDmQSNjdsmc35JDF1K5E55YMjF_7DPuGi-2fRUAw.ttf', fontWeight: 500 },
      { src: 'https://fonts.gstatic.com/s/ebgaramond/v32/SlGDmQSNjdsmc35JDF1K5E55YMjF_7DPuGi-NfNUAw.ttf', fontWeight: 600 },
      { src: 'https://fonts.gstatic.com/s/ebgaramond/v32/SlGDmQSNjdsmc35JDF1K5E55YMjF_7DPuGi-DPNUAw.ttf', fontWeight: 700 },
    ],
  })

  // Playfair Display - Display Serif
  Font.register({
    family: 'Playfair Display',
    fonts: [
      { src: 'https://fonts.gstatic.com/s/playfairdisplay/v40/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKdFvUDQ.ttf', fontWeight: 400 },
      { src: 'https://fonts.gstatic.com/s/playfairdisplay/v40/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKd3vUDQ.ttf', fontWeight: 500 },
      { src: 'https://fonts.gstatic.com/s/playfairdisplay/v40/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKebukDQ.ttf', fontWeight: 600 },
      { src: 'https://fonts.gstatic.com/s/playfairdisplay/v40/nuFvD-vYSZviVYUb_rj3ij__anPXJzDwcbmjWBN2PKeiukDQ.ttf', fontWeight: 700 },
    ],
  })

  // Disable hyphenation for better control
  Font.registerHyphenationCallback((word: string) => [word])
}
