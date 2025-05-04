import type { Metadata } from 'next'
import './globals.css'
import { Analytics } from '@vercel/analytics/react'  

export const metadata: Metadata = {
  title: 'Interactive Quiz',
  description: 'Interactive Quiz Application',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics /> 
      </body>
    </html>
  )
}
