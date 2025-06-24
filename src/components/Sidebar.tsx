'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  ClockIcon,
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

const PagosIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="18" 
    height="19" 
    viewBox="0 0 18 19" 
    fill="none"
    className="h-6 w-6"
  >
    <path 
      d="M16.5 7.56128V13.0613C16.5 14.1658 15.6046 15.0613 14.5 15.0613H3.5C2.39543 15.0613 1.5 14.1658 1.5 13.0613V6.56128C1.5 5.45671 2.39543 4.56128 3.5 4.56128H14.5C15.6046 4.56128 16.5 5.45671 16.5 6.56128V7.56128ZM16.5 7.56128H4.5" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
)

const MiNegocioIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="18" 
    height="19" 
    viewBox="0 0 18 19" 
    fill="none"
    className="h-6 w-6"
  >
    <path 
      d="M2.25 8.31128V14.5613C2.25 15.6658 3.14543 16.5613 4.25 16.5613H13.75C14.8546 16.5613 15.75 15.6658 15.75 14.5613V8.31128" 
      stroke="currentColor" 
      strokeWidth="1.5"
    />
    <path 
      d="M11.1249 16.5613V12.0613C11.1249 11.2329 10.4534 10.5613 9.62494 10.5613H8.12494C7.29651 10.5613 6.62494 11.2329 6.62494 12.0613V16.5613" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeMiterlimit="16"
    />
    <path 
      d="M16.3183 7.67546L15.1243 3.49645C15.0507 3.23887 14.8153 3.06128 14.5474 3.06128H11.625L11.9753 7.26505C11.9909 7.45171 12.0923 7.62049 12.2539 7.71532C12.5598 7.89492 13.0845 8.18345 13.5 8.31128C14.1995 8.52652 15.1959 8.47283 15.8452 8.40222C16.1974 8.36391 16.4157 8.01618 16.3183 7.67546Z" 
      stroke="currentColor" 
      strokeWidth="1.5"
    />
    <path 
      d="M10.5 8.31128C10.891 8.19099 11.3787 7.9284 11.6898 7.74818C11.8825 7.63653 11.9884 7.4223 11.9699 7.20032L11.625 3.06128H6.375L6.03008 7.20032C6.01158 7.4223 6.11747 7.63653 6.31021 7.74818C6.62133 7.9284 7.10904 8.19099 7.5 8.31128C8.61976 8.65582 9.38024 8.65582 10.5 8.31128Z" 
      stroke="currentColor" 
      strokeWidth="1.5"
    />
    <path 
      d="M2.87567 3.49645L1.68166 7.67546C1.58431 8.01618 1.80257 8.36391 2.15484 8.40222C2.80413 8.47283 3.80046 8.52652 4.5 8.31128C4.91546 8.18345 5.44019 7.89492 5.74614 7.71532C5.90767 7.62049 6.00913 7.45171 6.02469 7.26505L6.375 3.06128H3.45258C3.18469 3.06128 2.94926 3.23887 2.87567 3.49645Z" 
      stroke="currentColor" 
      strokeWidth="1.5"
    />
  </svg>
)

const PersonalIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="18" 
    height="19" 
    viewBox="0 0 18 19" 
    fill="none"
    className="h-6 w-6"
  >
    <path 
      d="M9 9.81127C11.0711 9.81127 12.75 8.13237 12.75 6.06127C12.75 3.99018 11.0711 2.31127 9 2.31127C6.92893 2.31127 5.25 3.99018 5.25 6.06127C5.25 8.13237 6.92893 9.81127 9 9.81127Z" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M2.25 16.5613C2.25 13.5613 5.25 11.0613 9 11.0613C12.75 11.0613 15.75 13.5613 15.75 16.5613" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
  </svg>
)

const menuItems = [
  { name: 'Reservas', icon: ReservasIcon, href: '/dashboard' },
  { name: 'Horarios', icon: ClockIcon, href: '/dashboard/horarios' },
  { name: 'Reportes', icon: ReportesIcon, href: '/dashboard/reportes' },
  { name: 'Servicios', icon: ServiciosIcon, href: '/dashboard/servicios' },
  { name: 'Personal', icon: PersonalIcon, href: '/dashboard/personal' },
  { name: 'Pagos', icon: PagosIcon, href: '/dashboard/pagos' },
  { name: 'Mi negocio', icon: MiNegocioIcon, href: '/dashboard/business' },
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
                className={`group flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors border ${
                  isActive 
                    ? 'bg-white text-black border-gray-200' 
                    : 'text-gray-600 hover:bg-white hover:text-black hover:border-gray-200 border-transparent'
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