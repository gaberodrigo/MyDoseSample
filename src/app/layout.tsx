import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { MotionConfig } from 'framer-motion'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { LenisProvider } from '@/providers/LenisProvider'
import { LoadingScreen } from '@/components/ui/LoadingScreen'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: 'MyDose — Precision at Scale',
    template: '%s | MyDose',
  },
  description:
    'The modern platform for teams who move fast without breaking things. Beautifully designed, engineered for performance.',
  openGraph: {
    title: 'MyDose — Precision at Scale',
    description: 'The modern platform for teams who move fast without breaking things.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground overflow-x-hidden">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <LenisProvider>
            <MotionConfig reducedMotion="user">
              <LoadingScreen />
              {children}
            </MotionConfig>
          </LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
