'use client'

import { useState } from 'react'
import DashboardHeader from '@/components/DashboardHeader'
import Sidebar from '@/components/Sidebar'
import { PlusIcon, PencilIcon, TrashIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { useServices, Service } from '@/context/ServicesContext'

// Intervalos de tiempo (importados de la página de horarios)
const timeIntervals = ['30 min', '1 hora', '1.5 horas', '2 horas']

export default function ServiciosPage() {
  const { services, addService, updateService, deleteService } = useServices()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [selectedType, setSelectedType] = useState<'service' | 'sport' | 'consultation' | null>(null)

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
    setSelectedType(type)
    setEditingService(null)
    setIsModalOpen(true)
    setShowAddMenu(false)
  }

  const handleEditService = (service: Service) => {
    setSelectedType(service.type)
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
    
    const newService: Service = {
      id: editingService?.id || Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      duration: intervalToMinutes(selectedInterval),
      durationInterval: selectedInterval,
      category: formData.get('category') as string,
      type: selectedType!,
      isActive: true,
      needsStaff: needsStaffValue === 'yes'
    }

    if (editingService) {
      // Actualizar servicio existente
      updateService(newService)
    } else {
      // Agregar nuevo servicio
      addService(newService)
    }

    setIsModalOpen(false)
    setSelectedType(null)
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
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Gestión de Servicios
                  </h1>
                  <p className="text-gray-600">
                    Administra tus servicios y canchas deportivas
                  </p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowAddMenu(!showAddMenu)}
                    className="flex items-center px-6 py-3 bg-[#006AFC] text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Agregar Servicio
                    <ChevronDownIcon className={`h-4 w-4 ml-2 transition-transform duration-200 ${showAddMenu ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Menú desplegable */}
                  {showAddMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <div className="p-2">
                        <button
                          onClick={() => handleAddService('service')}
                          className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">Servicio de Belleza</div>
                            <div className="text-sm text-gray-500">Corte, tinte, peinado, etc.</div>
                          </div>
                        </button>
                        
                        <button
                          onClick={() => handleAddService('sport')}
                          className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">Cancha Deportiva</div>
                            <div className="text-sm text-gray-500">Fútbol, pádel, tenis, etc.</div>
                          </div>
                        </button>

                        <button
                          onClick={() => handleAddService('consultation')}
                          className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <div className="font-medium text-gray-800">Consulta Profesional</div>
                            <div className="text-sm text-gray-500">Abogados, contadores, médicos, etc.</div>
                          </div>
                        </button>
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
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-3 ${
                        service.type === 'sport' ? 'bg-blue-100' : 
                        service.type === 'consultation' ? 'bg-green-100' : 'bg-pink-100'
                      }`}>
                        {service.type === 'sport' ? (
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                          </svg>
                        ) : service.type === 'consultation' ? (
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
                        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                          service.type === 'sport' 
                            ? 'bg-blue-100 text-blue-800' 
                            : service.type === 'consultation'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-pink-100 text-pink-800'
                        }`}>
                          {service.type === 'sport' ? 'Cancha' : 
                           service.type === 'consultation' ? 'Consulta' : 'Servicio'}
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
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <PlusIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No hay servicios agregados</h3>
                <p className="text-gray-600 mb-6">Comienza agregando tu primer servicio o cancha deportiva</p>
                <button
                  onClick={() => setShowAddMenu(true)}
                  className="px-6 py-3 bg-[#006AFC] text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Agregar Primer Servicio
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
                ? `Editar ${selectedType === 'sport' ? 'Cancha' : selectedType === 'consultation' ? 'Consulta' : 'Servicio'}`
                : `Agregar ${selectedType === 'sport' ? 'Cancha' : selectedType === 'consultation' ? 'Consulta' : 'Servicio'}`
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
                      Sí, este servicio requiere personal específico
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
                      No, este servicio no requiere personal específico
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setSelectedType(null)
                  }}
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