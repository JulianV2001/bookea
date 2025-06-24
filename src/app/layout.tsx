import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ScheduleProvider } from '@/context/ScheduleContext'
import { ServicesProvider } from '@/context/ServicesContext'
import { StaffProvider } from '@/context/StaffContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BOOKEA MVP',
  description: 'Sistema de reservas y gestión de negocio',
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
          <ServicesProvider>
            <StaffProvider>
              {children}
            </StaffProvider>
          </ServicesProvider>
        </ScheduleProvider>
      </body>
    </html>
  )
} 