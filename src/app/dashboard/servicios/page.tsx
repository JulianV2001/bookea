'use client'

import { useState } from 'react'
import DashboardHeader from '@/components/DashboardHeader'
import Sidebar from '@/components/Sidebar'
import { PlusIcon, PencilIcon, TrashIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { useServices, Service } from '@/context/ServicesContext'
import { useNiche } from '@/context/NicheContext'

// Intervalos de tiempo (importados de la página de horarios)
const timeIntervals = ['30 min', '1 hora', '1.5 horas', '2 horas']

// Configuración específica por nicho
const nicheConfig = {
  sport: {
    title: 'Canchas Deportivas',
    description: 'Administra tus canchas y espacios deportivos',
    icon: '⚽',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    serviceTypes: [
      {
        id: 'sport',
        title: 'Cancha Deportiva',
        description: 'Fútbol, pádel, tenis, etc.',
        icon: '⚽',
        color: 'text-blue-600',
        bgColor: 'bg-blue-100'
      }
    ]
  },
  beauty: {
    title: 'Estética y Peluquería',
    description: 'Administra tus servicios de estética, peluquería y belleza',
    icon: '✂️',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    serviceTypes: [
      {
        id: 'service',
        title: 'Servicio de Estética',
        description: 'Corte, tinte, peinado, tratamientos, etc.',
        icon: '✂️',
        color: 'text-pink-600',
        bgColor: 'bg-pink-100'
      }
    ]
  },
  consultation: {
    title: 'Consultas Profesionales',
    description: 'Administra tus consultas y asesorías',
    icon: '📋',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    serviceTypes: [
      {
        id: 'consultation',
        title: 'Consulta Profesional',
        description: 'Abogados, contadores, médicos, etc.',
        icon: '📋',
        color: 'text-green-600',
        bgColor: 'bg-green-100'
      }
    ]
  }
}

export default function ServiciosPage() {
  const { services, addService, updateService, deleteService } = useServices()
  const { selectedNiche } = useNiche()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [showAddMenu, setShowAddMenu] = useState(false)

  // Si no hay nicho seleccionado, redirigir a la selección
  if (!selectedNiche) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Nicho no seleccionado</h2>
          <p className="text-gray-600 mb-6">Por favor, selecciona un tipo de negocio para continuar</p>
          <a 
            href="/onboarding/niche-selection"
            className="px-6 py-3 bg-[#006AFC] text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Seleccionar Nicho
          </a>
        </div>
      </div>
    )
  }

  const config = nicheConfig[selectedNiche]

  // Función para convertir intervalo a minutos
  const intervalToMinutes = (interval: string): number => {
    switch (interval) {
      case '30 min': return 30
      case '1 hora': return 60
      case '1.5 horas': return 90
      case '2 horas': return 120
      default: return 60
    }
  }

  // Función para convertir minutos a intervalo
  const minutesToInterval = (minutes: number): string => {
    switch (minutes) {
      case 30: return '30 min'
      case 60: return '1 hora'
      case 90: return '1.5 horas'
      case 120: return '2 horas'
      default: return '1 hora'
    }
  }

  const handleAddService = (type: 'service' | 'sport' | 'consultation') => {
    setEditingService(null)
    setIsModalOpen(true)
    setShowAddMenu(false)
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setIsModalOpen(true)
  }

  const handleDeleteService = (serviceId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      deleteService(serviceId)
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const selectedInterval = formData.get('durationInterval') as string
    const needsStaffValue = formData.get('needsStaff') as string
    
    // Para nicho deportivo, siempre establecer needsStaff como false
    const finalNeedsStaff = selectedNiche === 'sport' ? false : needsStaffValue === 'yes'
    
    const newService: Service = {
      id: editingService?.id || Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      duration: intervalToMinutes(selectedInterval),
      durationInterval: selectedInterval,
      category: formData.get('category') as string,
      type: selectedNiche === 'sport' ? 'sport' : selectedNiche === 'beauty' ? 'service' : 'consultation',
      isActive: true,
      needsStaff: finalNeedsStaff
    }

    if (editingService) {
      // Actualizar servicio existente
      updateService(newService)
    } else {
      // Agregar nuevo servicio
      addService(newService)
    }

    setIsModalOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <Sidebar businessName="Fulbito FC" />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header con diseño mejorado */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className={`w-12 h-12 ${config.bgColor} rounded-lg flex items-center justify-center mr-4 text-2xl`}>
                    {config.icon}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                      {config.title}
                    </h1>
                    <p className="text-gray-600">
                      {config.description}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowAddMenu(!showAddMenu)}
                    className="flex items-center px-6 py-3 bg-[#006AFC] text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Agregar {selectedNiche === 'sport' ? 'Cancha' : selectedNiche === 'beauty' ? 'Servicio' : 'Consulta'}
                    <ChevronDownIcon className={`h-4 w-4 ml-2 transition-transform duration-200 ${showAddMenu ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Menú desplegable */}
                  {showAddMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <div className="p-2">
                        {config.serviceTypes.map((serviceType) => (
                          <button
                            key={serviceType.id}
                            onClick={() => handleAddService(serviceType.id as 'service' | 'sport' | 'consultation')}
                            className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <div className={`w-10 h-10 ${serviceType.bgColor} rounded-lg flex items-center justify-center mr-3`}>
                              <span className="text-lg">{serviceType.icon}</span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">{serviceType.title}</div>
                              <div className="text-sm text-gray-500">{serviceType.description}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Lista de Servicios */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 ${config.bgColor} rounded-lg flex items-center justify-center mr-3`}>
                        <span className="text-lg">{config.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${config.bgColor} ${config.color}`}>
                          {selectedNiche === 'sport' ? 'Cancha' : selectedNiche === 'beauty' ? 'Servicio' : 'Consulta'}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditService(service)}
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-medium text-gray-800">${service.price}</div>
                      <div className="text-gray-500">Precio</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-gray-800">{service.durationInterval || minutesToInterval(service.duration)}</div>
                      <div className="text-gray-500">Duración</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Estado vacío */}
            {services.length === 0 && (
              <div className="text-center py-12">
                <div className={`w-24 h-24 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 text-4xl`}>
                  {config.icon}
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  No hay {selectedNiche === 'sport' ? 'canchas' : selectedNiche === 'beauty' ? 'servicios' : 'consultas'} agregados
                </h3>
                <p className="text-gray-600 mb-6">
                  Comienza agregando tu primer {selectedNiche === 'sport' ? 'cancha deportiva' : selectedNiche === 'beauty' ? 'servicio de belleza' : 'consulta profesional'}
                </p>
                <button
                  onClick={() => setShowAddMenu(true)}
                  className="px-6 py-3 bg-[#006AFC] text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Agregar Primer {selectedNiche === 'sport' ? 'Cancha' : selectedNiche === 'beauty' ? 'Servicio' : 'Consulta'}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal para agregar/editar servicio */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">
              {editingService 
                ? `Editar ${selectedNiche === 'sport' ? 'Cancha' : selectedNiche === 'beauty' ? 'Servicio' : 'Consulta'}`
                : `Agregar ${selectedNiche === 'sport' ? 'Cancha' : selectedNiche === 'beauty' ? 'Servicio' : 'Consulta'}`
              }
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006AFC] focus:ring-[#006AFC]"
                  defaultValue={editingService?.name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  name="description"
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006AFC] focus:ring-[#006AFC]"
                  rows={3}
                  defaultValue={editingService?.description}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Precio</label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006AFC] focus:ring-[#006AFC]"
                    defaultValue={editingService?.price}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duración</label>
                  <select
                    name="durationInterval"
                    required
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006AFC] focus:ring-[#006AFC]"
                    defaultValue={editingService?.durationInterval || minutesToInterval(editingService?.duration || 60)}
                  >
                    {timeIntervals.map(interval => (
                      <option key={interval} value={interval}>{interval}</option>
                    ))}
                  </select>
                </div>
              </div>
              {/* Solo mostrar la pregunta de personal si NO es nicho deportivo */}
              {selectedNiche !== 'sport' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">¿Necesita personal?</label>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="needsStaff"
                        value="yes"
                        id="needsStaffYes"
                        defaultChecked={editingService?.needsStaff === true}
                        className="h-4 w-4 text-[#006AFC] focus:ring-[#006AFC] border-gray-300"
                      />
                      <label htmlFor="needsStaffYes" className="ml-2 text-sm text-gray-700">
                        Sí, este {selectedNiche === 'beauty' ? 'servicio' : 'consulta'} requiere personal específico
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="needsStaff"
                        value="no"
                        id="needsStaffNo"
                        defaultChecked={editingService?.needsStaff === false}
                        className="h-4 w-4 text-[#006AFC] focus:ring-[#006AFC] border-gray-300"
                      />
                      <label htmlFor="needsStaffNo" className="ml-2 text-sm text-gray-700">
                        No, este {selectedNiche === 'beauty' ? 'servicio' : 'consulta'} no requiere personal específico
                      </label>
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#006AFC] text-white rounded-lg hover:bg-blue-600"
                >
                  {editingService ? 'Guardar Cambios' : 'Agregar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 