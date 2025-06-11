'use client'

import { useState } from 'react'
import DashboardHeader from '@/components/DashboardHeader'
import Sidebar from '@/components/Sidebar'
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline'

interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number // en minutos
  category: string
  isActive: boolean
}

type BusinessType = 'sports' | 'beauty' | null

export default function ServiciosPage() {
  const [businessType, setBusinessType] = useState<BusinessType>(null)
  const [services, setServices] = useState<Service[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  const handleAddService = () => {
    setEditingService(null)
    setIsModalOpen(true)
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setIsModalOpen(true)
  }

  const handleDeleteService = (serviceId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      setServices(services.filter(service => service.id !== serviceId))
    }
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    
    const newService: Service = {
      id: editingService?.id || Math.random().toString(36).substr(2, 9),
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      duration: Number(formData.get('duration')),
      category: formData.get('category') as string,
      isActive: true
    }

    if (editingService) {
      // Actualizar servicio existente
      setServices(services.map(service => 
        service.id === editingService.id ? newService : service
      ))
    } else {
      // Agregar nuevo servicio
      setServices([...services, newService])
    }

    setIsModalOpen(false)
  }

  // Si no se ha seleccionado el tipo de negocio, mostrar las opciones
  if (!businessType) {
    return (
      <div className="min-h-screen bg-gray-50">
        <DashboardHeader />
        <div className="flex">
          <Sidebar businessName="Fulbito FC" />
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-2xl font-semibold text-gray-800 mb-8">Selecciona el tipo de negocio</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => setBusinessType('sports')}
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Negocio Deportivo</h2>
                    <p className="text-gray-600">Gestiona canchas de fútbol, pádel, tenis y más</p>
                  </div>
                </button>

                <button
                  onClick={() => setBusinessType('beauty')}
                  className="bg-white p-6 rounded-lg border border-gray-200 hover:border-pink-500 hover:shadow-lg transition-all"
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Belleza y Estética</h2>
                    <p className="text-gray-600">Gestiona servicios de peluquería, estética y más</p>
                  </div>
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // Renderizar el contenido específico según el tipo de negocio
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <Sidebar businessName="Fulbito FC" />
        <main className="flex-1 p-6">
          <div className="bg-white rounded-lg border border-gray-200">
            {/* Encabezado */}
            <div className="border-b border-gray-200 p-4">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-semibold text-gray-800">
                    {businessType === 'sports' ? 'Gestión de Canchas' : 'Gestión de Servicios'}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {businessType === 'sports' 
                      ? 'Administra tus canchas deportivas' 
                      : 'Administra tus servicios de belleza y estética'}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setBusinessType(null)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                  >
                    Cambiar tipo de negocio
                  </button>
                  <button
                    onClick={handleAddService}
                    className="flex items-center px-4 py-2 bg-[#006AFC] text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    {businessType === 'sports' ? 'Agregar Cancha' : 'Agregar Servicio'}
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de Servicios */}
            <div className="p-4">
              <div className="grid grid-cols-1 gap-4">
                {services.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">{service.name}</h3>
                        <p className="text-gray-600 mt-1">{service.description}</p>
                        <div className="mt-2 flex items-center space-x-4">
                          <span className="text-sm text-gray-500">
                            Precio: ${service.price}
                          </span>
                          <span className="text-sm text-gray-500">
                            Duración: {service.duration} min
                          </span>
                          <span className="text-sm text-gray-500">
                            Categoría: {service.category}
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
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal para agregar/editar servicio */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingService 
                ? `Editar ${businessType === 'sports' ? 'Cancha' : 'Servicio'}`
                : `Agregar ${businessType === 'sports' ? 'Cancha' : 'Servicio'}`
              }
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006AFC] focus:ring-[#006AFC]"
                  defaultValue={editingService?.name}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  name="description"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006AFC] focus:ring-[#006AFC]"
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
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006AFC] focus:ring-[#006AFC]"
                    defaultValue={editingService?.price}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Duración (min)</label>
                  <input
                    type="number"
                    name="duration"
                    required
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006AFC] focus:ring-[#006AFC]"
                    defaultValue={editingService?.duration}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Categoría</label>
                <select
                  name="category"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#006AFC] focus:ring-[#006AFC]"
                  defaultValue={editingService?.category}
                >
                  {businessType === 'sports' ? (
                    <>
                      <option value="Fútbol">Fútbol</option>
                      <option value="Pádel">Pádel</option>
                      <option value="Tenis">Tenis</option>
                      <option value="Otro">Otro</option>
                    </>
                  ) : (
                    <>
                      <option value="Corte">Corte de pelo</option>
                      <option value="Barba">Barba</option>
                      <option value="Tinte">Tinte</option>
                      <option value="Peinado">Peinado</option>
                      <option value="Otro">Otro</option>
                    </>
                  )}
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#006AFC] text-white rounded-md hover:bg-blue-600"
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