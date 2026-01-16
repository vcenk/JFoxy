import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Inter, Roboto, Open_Sans, Lato, Montserrat, Playfair_Display, Raleway, Poppins, Merriweather } from 'next/font/google'
import { Providers } from './providers'
import './globals.css'

// Plus Jakarta Sans - modern, clean font similar to Open Runde
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

// Resume Builder Fonts
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const roboto = Roboto({
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
  weight: ['400', '500', '700'],
})

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin'],
  variable: '--font-lato',
  display: 'swap',
  weight: ['400', '700'],
})

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

const raleway = Raleway({
  subsets: ['latin'],
  variable: '--font-raleway',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
  weight: ['400', '600', '700'],
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const merriweather = Merriweather({
  subsets: ['latin'],
  variable: '--font-merriweather',
  display: 'swap',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://jobfoxy.com'),
  title: {
    default: 'Job Foxy | AI Interview Coach & Resume Analysis',
    template: '%s | Job Foxy'
  },
  description: 'Stop guessing. Master your interview with AI-powered resume gap analysis, smart job description breakdowns, and realistic mock interview practice.',
  keywords: ['interview preparation', 'AI career coach', 'resume analysis', 'mock interview', 'STAR method', 'interview practice', 'job foxy'],
  authors: [{ name: 'Job Foxy' }],
  creator: 'Job Foxy',
  publisher: 'Job Foxy',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://jobfoxy.com',
    title: 'Job Foxy | Stop Guessing. Master Your Interview.',
    description: 'AI-powered interview intelligence. Get resume gap analysis, smart job description breakdowns, and realistic mock interviews.',
    siteName: 'Job Foxy',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Job Foxy | AI Interview Coach',
    description: 'Stop guessing. Master your interview with clarity.',
    creator: '@jobfoxy',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Add Google Fonts link for additional fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={`${plusJakarta.variable} ${inter.variable} ${roboto.variable} ${openSans.variable} ${lato.variable} ${montserrat.variable} ${raleway.variable} ${poppins.variable} ${playfair.variable} ${merriweather.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'Job Foxy',
              applicationCategory: 'EducationalApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              description:
                'AI-powered interview coaching and resume analysis tool. Master your interviews with clarity.',
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.9',
                ratingCount: '150',
              },
            }),
          }}
        />
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
