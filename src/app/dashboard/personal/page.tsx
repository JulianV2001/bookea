'use client'

import { useState } from 'react'
import DashboardHeader from '@/components/DashboardHeader'
import Sidebar from '@/components/Sidebar'
import { PlusIcon, PencilIcon, TrashIcon, UserIcon, PhoneIcon, EnvelopeIcon, ClockIcon, LinkIcon } from '@heroicons/react/24/outline'
import { useServices } from '@/context/ServicesContext'
import { useStaff, Staff } from '@/context/StaffContext'

export default function PersonalPage() {
  const { services } = useServices()
  const { staff, addStaff, updateStaff, deleteStaff } = useStaff()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    phone: '',
    email: '',
    schedule: '',
    isActive: true
  })
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [selectedServiceId, setSelectedServiceId] = useState('')

  const handleAddStaff = () => {
    setEditingStaff(null)
    setFormData({
      name: '',
      position: '',
      phone: '',
      email: '',
      schedule: '',
      isActive: true
    })
    setIsModalOpen(true)
  }

  const handleEditStaff = (staffMember: Staff) => {
    setEditingStaff(staffMember)
    setFormData({
      name: staffMember.name,
      position: staffMember.position,
      phone: staffMember.phone,
      email: staffMember.email,
      schedule: staffMember.schedule,
      isActive: staffMember.isActive
    })
    setIsModalOpen(true)
  }

  const handleDeleteStaff = (staffId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este miembro del personal?')) {
      deleteStaff(staffId)
    }
  }

  const handleAssignService = (staffMember: Staff) => {
    setSelectedStaff(staffMember)
    setSelectedServiceId('')
    setShowAssignModal(true)
  }

  const handleAssignServiceSubmit = () => {
    if (!selectedStaff || !selectedServiceId) return

    const updatedStaff = {
      ...selectedStaff,
      services: selectedStaff.services.includes(selectedServiceId) 
        ? selectedStaff.services 
        : [...selectedStaff.services, selectedServiceId]
    }
    
    updateStaff(updatedStaff)

    setShowAssignModal(false)
    setSelectedStaff(null)
    setSelectedServiceId('')
  }

  const handleRemoveService = (staffId: string, serviceId: string) => {
    const staffMember = staff.find(s => s.id === staffId)
    if (!staffMember) return
    
    const updatedStaff = {
      ...staffMember,
      services: staffMember.services.filter(id => id !== serviceId)
    }
    
    updateStaff(updatedStaff)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newStaff: Staff = {
      id: editingStaff?.id || Math.random().toString(36).substr(2, 9),
      name: formData.name,
      position: formData.position,
      phone: formData.phone,
      email: formData.email,
      schedule: formData.schedule,
      isActive: formData.isActive,
      services: editingStaff?.services || []
    }

    if (editingStaff) {
      updateStaff(newStaff)
    } else {
      addStaff(newStaff)
    }

    setIsModalOpen(false)
    setEditingStaff(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      <div className="flex">
        <Sidebar businessName="Fulbito FC" />
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    Gestión de Personal
                  </h1>
                  <p className="text-gray-600">
                    Administra tu equipo de trabajo y asigna personal a los servicios
                  </p>
                </div>
                <button
                  onClick={handleAddStaff}
                  className="flex items-center px-6 py-3 bg-[#006AFC] text-white rounded-lg hover:bg-blue-600 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  Agregar Personal
                </button>
              </div>
            </div>

            {/* Lista de Personal */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {staff.map((staffMember) => (
                <div
                  key={staffMember.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-200"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                        <UserIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{staffMember.name}</h3>
                        <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                          {staffMember.position}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditStaff(staffMember)}
                        className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(staffMember.id)}
                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {staffMember.phone}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {staffMember.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <ClockIcon className="h-4 w-4 mr-2 text-gray-400" />
                      {staffMember.schedule}
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        staffMember.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {staffMember.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                      <button
                        onClick={() => handleAssignService(staffMember)}
                        className="flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                      >
                        <LinkIcon className="h-3 w-3 mr-1" />
                        Asignar servicio
                      </button>
                    </div>
                    
                    {/* Servicios asignados */}
                    {staffMember.services.length > 0 && (
                      <div className="mt-3">
                        <div className="text-xs text-gray-500 mb-2">Servicios asignados:</div>
                        <div className="space-y-1">
                          {staffMember.services.map(serviceId => {
                            const service = services.find(s => s.id === serviceId)
                            return service ? (
                              <div key={serviceId} className="flex items-center justify-between bg-gray-50 rounded px-2 py-1">
                                <span className="text-xs text-gray-700">{service.name}</span>
                                <button
                                  onClick={() => handleRemoveService(staffMember.id, serviceId)}
                                  className="text-red-400 hover:text-red-600 text-xs"
                                >
                                  ×
                                </button>
                              </div>
                            ) : null
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Estado vacío */}
            {staff.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserIcon className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">No hay personal agregado</h3>
                <p className="text-gray-600 mb-6">Comienza agregando tu primer miembro del equipo</p>
                <button
                  onClick={handleAddStaff}
                  className="px-6 py-3 bg-[#006AFC] text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Agregar Primer Miembro
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Modal para agregar/editar personal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">
              {editingStaff ? 'Editar Personal' : 'Agregar Personal'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre completo</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006AFC] focus:ring-[#006AFC]"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Cargo/Puesto</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006AFC] focus:ring-[#006AFC]"
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                <input
                  type="tel"
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006AFC] focus:ring-[#006AFC]"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  required
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006AFC] focus:ring-[#006AFC]"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Horario de trabajo</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Lunes a Viernes, 14:00 - 22:00"
                  className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#006AFC] focus:ring-[#006AFC]"
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="h-4 w-4 text-[#006AFC] focus:ring-[#006AFC] border-gray-300 rounded"
                />
                <label className="ml-2 text-sm text-gray-700">Personal activo</label>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false)
                    setEditingStaff(null)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#006AFC] text-white rounded-lg hover:bg-blue-600"
                >
                  {editingStaff ? 'Guardar Cambios' : 'Agregar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal para asignar servicios */}
      {showAssignModal && selectedStaff && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-semibold mb-4">
              Asignar servicio a {selectedStaff.name}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Seleccionar servicio
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AFC]"
                >
                  <option value="">Seleccionar un servicio</option>
                  {services
                    .filter(service => service.needsStaff)
                    .map(service => (
                      <option key={service.id} value={service.id}>
                        {service.name} ({service.type === 'sport' ? 'Deporte' : service.type === 'consultation' ? 'Consulta' : 'Servicio'})
                      </option>
                    ))}
                </select>
              </div>
              
              {selectedServiceId && (
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Solo se muestran servicios que requieren personal específico.
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowAssignModal(false)
                  setSelectedStaff(null)
                  setSelectedServiceId('')
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleAssignServiceSubmit}
                disabled={!selectedServiceId}
                className="px-4 py-2 bg-[#006AFC] text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Asignar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 