'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ClockIcon,
  CreditCardIcon,
  BuildingStorefrontIcon,
  CalendarIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline'

const ReservasIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 18 19" 
    fill="none"
    className="h-6 w-6"
  >
    <path 
      d="M11.25 3.81127V2.31127M11.25 3.81127V5.31127M11.25 3.81127H7.875M2.25 8.31127V15.0613C2.25 15.8897 2.92157 16.5613 3.75 16.5613H14.25C15.0784 16.5613 15.75 15.8897 15.75 15.0613V8.31127H2.25Z" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M2.25 8.31127V5.31127C2.25 4.48284 2.92157 3.81127 3.75 3.81127H5.25" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M5.25 2.31127V5.31127" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M15.75 8.31127V5.31127C15.75 4.48284 15.0784 3.81127 14.25 3.81127H13.875" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
)

const ServiciosIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 18 19" 
    fill="none"
    className="h-6 w-6"
  >
    <path 
      d="M10.5 15.9613V11.9113C10.5 11.5799 10.7686 11.3113 11.1 11.3113H15.15C15.4814 11.3113 15.75 11.5799 15.75 11.9113V15.9613C15.75 16.2927 15.4814 16.5613 15.15 16.5613H11.1C10.7686 16.5613 10.5 16.2927 10.5 15.9613Z" 
      stroke="currentColor" 
      strokeWidth="1.5"
    />
    <path 
      d="M2.25 15.9613V11.9113C2.25 11.5799 2.51863 11.3113 2.85 11.3113H6.9C7.23137 11.3113 7.5 11.5799 7.5 11.9113V15.9613C7.5 16.2927 7.23137 16.5613 6.9 16.5613H2.85C2.51863 16.5613 2.25 16.2927 2.25 15.9613Z" 
      stroke="currentColor" 
      strokeWidth="1.5"
    />
    <path 
      d="M10.5 7.71128V3.66128C10.5 3.32991 10.7686 3.06128 11.1 3.06128H15.15C15.4814 3.06128 15.75 3.32991 15.75 3.66128V7.71128C15.75 8.04265 15.4814 8.31128 15.15 8.31128H11.1C10.7686 8.31128 10.5 8.04265 10.5 7.71128Z" 
      stroke="currentColor" 
      strokeWidth="1.5"
    />
    <path 
      d="M2.25 7.71128V3.66128C2.25 3.32991 2.51863 3.06128 2.85 3.06128H6.9C7.23137 3.06128 7.5 3.32991 7.5 3.66128V7.71128C7.5 8.04265 7.23137 8.31128 6.9 8.31128H2.85C2.51863 8.31128 2.25 8.04265 2.25 7.71128Z" 
      stroke="currentColor" 
      strokeWidth="1.5"
    />
  </svg>
)

const ReportesIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 18 19" 
    fill="none"
    className="h-6 w-6"
  >
    <path 
      d="M6.75 16.5613H11.25M6.75 16.5613V12.8113M6.75 16.5613H2.85C2.51863 16.5613 2.25 16.2927 2.25 15.9613V13.4113C2.25 13.0799 2.51863 12.8113 2.85 12.8113H6.75M11.25 16.5613V7.56128M11.25 16.5613H15.15C15.4814 16.5613 15.75 16.2927 15.75 15.9613V3.66128C15.75 3.32991 15.4814 3.06128 15.15 3.06128H11.85C11.5186 3.06128 11.25 3.32991 11.25 3.66128V7.56128M11.25 7.56128H7.35C7.01863 7.56128 6.75 7.82991 6.75 8.16128V12.8113" 
      stroke="currentColor" 
      strokeWidth="1.5"
    />
  </svg>
)

const menuItems = [
  { name: 'Reservas', icon: ReservasIcon, href: '/dashboard' },
  { name: 'Horarios', icon: ClockIcon, href: '/dashboard/horarios' },
  { name: 'Reportes', icon: ReportesIcon, href: '/dashboard/reportes' },
  { name: 'Servicios', icon: ServiciosIcon, href: '/dashboard/servicios' },
  { name: 'Pagos', icon: CreditCardIcon, href: '/dashboard/pagos' },
  { name: 'Mi negocio', icon: BuildingStorefrontIcon, href: '/dashboard/business' },
]

export default function Sidebar({ businessName }: { businessName: string }) {
  const pathname = usePathname()

  return (
    <aside className="w-64 h-[calc(100vh-57.81px)] bg-gray-50 shadow-sm">
      <div className="p-4">
        <h2 className="font-inter text-[28px] font-semibold leading-[36px] tracking-[-0.01em] text-gray-800 mb-6">{businessName}</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-white text-black border border-gray-200' 
                    : 'text-gray-600 hover:bg-white hover:text-black hover:border hover:border-gray-200'
                }`}
              >
                <item.icon className={`h-6 w-6 transition-colors ${
                  isActive 
                    ? 'text-black' 
                    : 'text-gray-600 group-hover:text-black'
                }`} />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
} 