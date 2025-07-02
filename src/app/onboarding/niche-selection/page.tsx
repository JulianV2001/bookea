'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useNiche, NicheType } from '@/context/NicheContext'

interface NicheOption {
  id: NicheType
  title: string
  description: string
  icon: string
  color: string
  bgColor: string
  features: string[]
}

const nicheOptions: NicheOption[] = [
  {
    id: 'sport',
    title: 'Canchas Deportivas',
    description: 'Gestiona reservas de fútbol, pádel, tenis y más deportes',
    icon: '⚽',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    features: [
      'Reservas por cancha y horario',
      'Gestión de equipos y torneos',
      'Control de pagos y membresías',
      'Reportes de ocupación'
    ]
  },
  {
    id: 'beauty',
    title: 'Estética y Peluquería',
    description: 'Administra citas para salones, peluquerías, spas y servicios de belleza',
    icon: '✂️',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    features: [
      'Agenda de citas por especialista',
      'Gestión de servicios y tratamientos',
      'Recordatorios automáticos',
      'Historial de clientes'
    ]
  },
  {
    id: 'consultation',
    title: 'Consultas Profesionales',
    description: 'Organiza citas para abogados, médicos, contadores y más',
    icon: '📋',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    features: [
      'Agenda por profesional',
      'Gestión de consultorios',
      'Documentos y expedientes',
      'Facturación integrada'
    ]
  }
]

export default function NicheSelectionPage() {
  const router = useRouter()
  const { setSelectedNiche } = useNiche()
  const [selectedNiche, setSelectedNicheState] = useState<NicheType | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleNicheSelection = (niche: NicheType) => {
    setSelectedNicheState(niche)
  }

  const handleContinue = async () => {
    if (!selectedNiche) return
    
    setIsLoading(true)
    
    // Guardar la selección en el contexto
    setSelectedNiche(selectedNiche)
    
    // Simular un pequeño delay para mejor UX
    setTimeout(() => {
      router.push('/register')
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors mb-6"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            Volver
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Elige tu tipo de negocio
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Selecciona el nicho que mejor se adapte a tu negocio para personalizar tu experiencia
            </p>
          </div>
        </div>

        {/* Opciones de nicho */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {nicheOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => handleNicheSelection(option.id)}
                className={`relative cursor-pointer rounded-2xl p-6 border-2 transition-all duration-200 hover:shadow-lg ${
                  selectedNiche === option.id
                    ? `border-${option.color.split('-')[1]}-500 bg-white shadow-lg`
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                {/* Checkmark overlay */}
                {selectedNiche === option.id && (
                  <div className={`absolute -top-2 -right-2 w-8 h-8 ${option.bgColor} rounded-full flex items-center justify-center border-2 border-white shadow-lg`}>
                    <CheckIcon className={`w-5 h-5 ${option.color}`} />
                  </div>
                )}

                <div className="text-center">
                  <div className={`w-16 h-16 ${option.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 text-3xl`}>
                    {option.icon}
                  </div>
                  
                  <h3 className={`text-xl font-semibold mb-2 ${option.color}`}>
                    {option.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm mb-4">
                    {option.description}
                  </p>

                  <ul className="text-left space-y-2">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <div className={`w-2 h-2 rounded-full ${option.bgColor.replace('bg-', 'bg-').replace('-50', '-400')} mr-3`}></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Botón continuar */}
          <div className="text-center">
            <button
              onClick={handleContinue}
              disabled={!selectedNiche || isLoading}
              className={`px-8 py-4 rounded-xl text-lg font-semibold transition-all duration-200 ${
                selectedNiche && !isLoading
                  ? 'bg-[#006AFC] text-white hover:bg-blue-600 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Configurando...
                </div>
              ) : (
                'Continuar'
              )}
            </button>
            
            {selectedNiche && (
              <p className="text-sm text-gray-500 mt-4">
                Has seleccionado: <span className="font-medium">{nicheOptions.find(o => o.id === selectedNiche)?.title}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 