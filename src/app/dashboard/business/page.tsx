'use client'

import { useState } from 'react'
import DashboardHeader from '@/components/DashboardHeader'
import Sidebar from '@/components/Sidebar'
import { 
  BuildingStorefrontIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon,
  ClockIcon,
  GlobeAltIcon,
  PhotoIcon
} from '@heroicons/react/24/outline'

interface BusinessHours {
  day: string
  open: string
  close: string
  isOpen: boolean
}

interface BusinessInfo {
  name: string
  description: string
  address: string
  phone: string
  email: string
  website: string
  logo: string
  businessHours: BusinessHours[]
  news?: string
}

export default function BusinessPage() {
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    name: 'Fulbito FC',
    description: 'Club deportivo con canchas de fútbol 5, pádel y tenis. Instalaciones de primer nivel para disfrutar del deporte.',
    address: 'Av. Rivadavia 1234, Buenos Aires',
    phone: '+54 11 1234-5678',
    email: 'info@fulbitofc.com',
    website: 'www.fulbitofc.com',
    logo: '',
    businessHours: [
      { day: 'Lunes', open: '08:00', close: '22:00', isOpen: true },
      { day: 'Martes', open: '08:00', close: '22:00', isOpen: true },
      { day: 'Miércoles', open: '08:00', close: '22:00', isOpen: true },
      { day: 'Jueves', open: '08:00', close: '22:00', isOpen: true },
      { day: 'Viernes', open: '08:00', close: '23:00', isOpen: true },
      { day: 'Sábado', open: '09:00', close: '23:00', isOpen: true },
      { day: 'Domingo', open: '09:00', close: '22:00', isOpen: true },
    ]
  })

  const [isEditing, setIsEditing] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Aquí iría la lógica para guardar los cambios
    setIsEditing(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <Sidebar businessName={businessInfo.name} />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Encabezado */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-800">Mi Negocio</h1>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-4 py-2 bg-[#006AFC] text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  {isEditing ? 'Cancelar' : 'Editar Información'}
                </button>
              </div>
            </div>

            {/* Formulario de Información */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Logo y Nombre */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="flex items-center space-x-6">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                    {businessInfo.logo ? (
                      <img src={businessInfo.logo} alt="Logo" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <PhotoIcon className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Negocio</label>
                    <input
                      type="text"
                      value={businessInfo.name}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AFC] disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <textarea
                  value={businessInfo.description}
                  onChange={(e) => setBusinessInfo({ ...businessInfo, description: e.target.value })}
                  disabled={!isEditing}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AFC] disabled:bg-gray-50"
                />
              </div>

              {/* Información de Contacto */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Información de Contacto</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center space-x-2">
                        <MapPinIcon className="h-5 w-5 text-gray-400" />
                        <span>Dirección</span>
                      </div>
                    </label>
                    <input
                      type="text"
                      value={businessInfo.address}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AFC] disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center space-x-2">
                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                        <span>Teléfono</span>
                      </div>
                    </label>
                    <input
                      type="tel"
                      value={businessInfo.phone}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AFC] disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center space-x-2">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        <span>Email</span>
                      </div>
                    </label>
                    <input
                      type="email"
                      value={businessInfo.email}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AFC] disabled:bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <div className="flex items-center space-x-2">
                        <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                        <span>Sitio Web</span>
                      </div>
                    </label>
                    <input
                      type="url"
                      value={businessInfo.website}
                      onChange={(e) => setBusinessInfo({ ...businessInfo, website: e.target.value })}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AFC] disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>

              {/* Novedades */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-lg font-medium text-gray-800 mb-4">Novedades</h2>
                <textarea
                  value={businessInfo.news || ''}
                  onChange={e => setBusinessInfo({ ...businessInfo, news: e.target.value })}
                  disabled={!isEditing}
                  rows={4}
                  placeholder="Escribe aquí las novedades o anuncios importantes para tus clientes..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AFC] disabled:bg-gray-50"
                />
              </div>

              {/* Sección de Suscripción */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Suscripción</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600">Plan actual</p>
                      <p className="text-lg font-medium text-gray-800">Plan Gratuito</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Activo
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="space-y-3">
                      <button className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 13.3333V10M10 6.66667H10.0083M18.3333 10C18.3333 14.6024 14.6024 18.3333 10 18.3333C5.39763 18.3333 1.66667 14.6024 1.66667 10C1.66667 5.39763 5.39763 1.66667 10 1.66667C14.6024 1.66667 18.3333 5.39763 18.3333 10Z" stroke="#006AFC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="text-gray-700">Cambiar suscripción</span>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M7.5 15L12.5 10L7.5 5" stroke="#475163" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button className="w-full flex items-center justify-between px-4 py-3 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M10 13.3333V10M10 6.66667H10.0083M18.3333 10C18.3333 14.6024 14.6024 18.3333 10 18.3333C5.39763 18.3333 1.66667 14.6024 1.66667 10C1.66667 5.39763 5.39763 1.66667 10 1.66667C14.6024 1.66667 18.3333 5.39763 18.3333 10Z" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span className="text-red-600">Darse de baja</span>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M7.5 15L12.5 10L7.5 5" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Botones de Acción */}
              {isEditing && (
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#006AFC] text-white rounded-md hover:bg-blue-600"
                  >
                    Guardar Cambios
                  </button>
                </div>
              )}
            </form>
          </div>
        </main>
      </div>
    </div>
  )
} 