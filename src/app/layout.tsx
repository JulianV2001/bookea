import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ScheduleProvider } from '@/context/ScheduleContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Bookea',
  description: 'Sistema de reservas online',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ScheduleProvider>
          {children}
        </ScheduleProvider>
      </body>
    </html>
  )
} 