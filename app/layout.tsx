import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Energy Journal',
  description: 'Track, Analyze, and Optimize Your Energy Consumption',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full bg-white">
      <body className={`${inter.className} h-full`}>{children}</body>
    </html>
  )
}
