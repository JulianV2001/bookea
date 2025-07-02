'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { useNiche } from '@/context/NicheContext'

const nicheConfig = {
  sport: {
    title: 'Canchas Deportivas',
    icon: '⚽',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    description: 'Completa tu registro para comenzar a gestionar tus canchas'
  },
  beauty: {
    title: 'Estética y Peluquería',
    icon: '✂️',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    description: 'Completa tu registro para comenzar a gestionar tu salón o peluquería'
  },
  consultation: {
    title: 'Consultas Profesionales',
    icon: '📋',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    description: 'Completa tu registro para comenzar a gestionar tus consultas'
  }
}

export default function RegisterPage() {
  const router = useRouter()
  const { selectedNiche } = useNiche()
  const [isLoading, setIsLoading] = useState(false)

  // Si no hay nicho seleccionado, redirigir a la selección
  if (!selectedNiche) {
    router.push('/onboarding/niche-selection')
    return null
  }

  const config = nicheConfig[selectedNiche]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    
    // Aquí iría la lógica de registro
    // Por ahora simulamos un delay
    setTimeout(() => {
      router.push('/dashboard')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/onboarding/niche-selection"
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-6"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Volver
          </Link>
          
          <div className="text-center">
            <div className={`w-20 h-20 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-6 text-3xl`}>
              {config.icon}
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              {config.title}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {config.description}
            </p>
          </div>
        </div>

        {/* Formulario de registro */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Negocio
                </label>
                <input
                  id="businessName"
                  name="businessName"
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006AFC] focus:border-[#006AFC] transition-colors"
                  placeholder={`Ej: ${selectedNiche === 'sport' ? 'Fulbito FC' : selectedNiche === 'beauty' ? 'Salón de Belleza María' : 'Consultorio Dr. García'}`}
                />
              </div>

              <div>
                <label htmlFor="ownerName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Propietario
                </label>
                <input
                  id="ownerName"
                  name="ownerName"
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006AFC] focus:border-[#006AFC] transition-colors"
                  placeholder="Tu nombre completo"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006AFC] focus:border-[#006AFC] transition-colors"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006AFC] focus:border-[#006AFC] transition-colors"
                  placeholder="+54 9 11 1234-5678"
                />
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección
                </label>
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006AFC] focus:border-[#006AFC] transition-colors"
                  placeholder="Dirección completa"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006AFC] focus:border-[#006AFC] transition-colors"
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Contraseña
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006AFC] focus:border-[#006AFC] transition-colors"
                  placeholder="Repite tu contraseña"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#006AFC] hover:bg-blue-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Creando cuenta...
                  </div>
                ) : (
                  'Crear Cuenta'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                ¿Ya tienes una cuenta?{' '}
                <Link href="/login" className="text-[#006AFC] hover:underline font-medium">
                  Iniciar sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 