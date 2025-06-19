'use client'

import { useState } from 'react'
import DashboardHeader from '@/components/DashboardHeader'
import Sidebar from '@/components/Sidebar'
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, XMarkIcon, CalendarIcon, ClockIcon, TrashIcon } from '@heroicons/react/24/outline'
import { useSchedule } from '@/context/ScheduleContext'

// Días de la semana
const weekDays = [
  { id: 1, name: 'Lunes' },
  { id: 2, name: 'Martes' },
  { id: 3, name: 'Miércoles' },
  { id: 4, name: 'Jueves' },
  { id: 5, name: 'Viernes' },
  { id: 6, name: 'Sábado' },
  { id: 7, name: 'Domingo' }
]

// Horas disponibles (de 7 AM a 10 PM)
const timeSlots = Array.from({ length: 16 }, (_, i) => {
  const hour = i + 7
  return `${hour.toString().padStart(2, '0')}:00`
})

type TimeBlock = {
  id: string
  openTime: string
  closeTime: string
}

type DaySchedule = {
  isOpen: boolean
  timeBlocks: TimeBlock[]
  blockedHours: string[]
}

type ScheduleConfig = {
  [key: number]: DaySchedule
}

export default function HorariosPage() {
  const { scheduleConfig, updateScheduleConfig, specialDates, addSpecialDate, removeSpecialDate, maxBookingDays, updateMaxBookingDays } = useSchedule()
  const [activeTab, setActiveTab] = useState<'weekly' | 'special'>('weekly')
  const [selectedSpecialDate, setSelectedSpecialDate] = useState<string>('')

  // Obtener los días que están actualmente abiertos
  const getOpenDays = () => {
    return weekDays.filter(day => scheduleConfig[day.id]?.isOpen).map(day => day.id)
  }

  const handleDayToggle = (dayId: number) => {
    const newConfig = { ...scheduleConfig }
    const currentDay = scheduleConfig[dayId]
    
    // Si el día no está configurado, marcarlo como abierto por defecto
    if (!currentDay) {
      newConfig[dayId] = {
        isOpen: true,
        timeBlocks: [
          { id: '1', openTime: '09:00', closeTime: '12:00' },
          { id: '2', openTime: '14:00', closeTime: '18:00' }
        ],
        blockedHours: []
      }
    } else {
      // Si ya está configurado, cambiar su estado
      newConfig[dayId] = {
        ...currentDay,
        isOpen: !currentDay.isOpen
      }
    }
    
    updateScheduleConfig(newConfig)
  }

  const handleDaySetOpen = (dayId: number) => {
    const newConfig = { ...scheduleConfig }
    const currentDay = scheduleConfig[dayId]
    
    newConfig[dayId] = {
      isOpen: true,
      timeBlocks: currentDay?.timeBlocks || [
        { id: '1', openTime: '09:00', closeTime: '12:00' },
        { id: '2', openTime: '14:00', closeTime: '18:00' }
      ],
      blockedHours: currentDay?.blockedHours || []
    }
    
    updateScheduleConfig(newConfig)
  }

  const handleDaySetClosed = (dayId: number) => {
    const newConfig = { ...scheduleConfig }
    const currentDay = scheduleConfig[dayId]
    
    newConfig[dayId] = {
      isOpen: false,
      timeBlocks: currentDay?.timeBlocks || [
        { id: '1', openTime: '09:00', closeTime: '12:00' },
        { id: '2', openTime: '14:00', closeTime: '18:00' }
      ],
      blockedHours: currentDay?.blockedHours || []
    }
    
    updateScheduleConfig(newConfig)
  }

  const handleSetAllDaysClosed = () => {
    const newConfig = { ...scheduleConfig }
    
    weekDays.forEach(day => {
      newConfig[day.id] = {
        isOpen: false,
        timeBlocks: [
          { id: '1', openTime: '09:00', closeTime: '12:00' },
          { id: '2', openTime: '14:00', closeTime: '18:00' }
        ],
        blockedHours: []
      }
    })
    
    updateScheduleConfig(newConfig)
  }

  const handleAddTimeBlock = (dayId: number) => {
    const newConfig = { ...scheduleConfig }
    const currentBlocks = newConfig[dayId]?.timeBlocks || []
    const newBlockId = (currentBlocks.length + 1).toString()
    
    newConfig[dayId] = {
      ...newConfig[dayId],
      timeBlocks: [
        ...currentBlocks,
        { id: newBlockId, openTime: '09:00', closeTime: '12:00' }
      ]
    }
    
    updateScheduleConfig(newConfig)
  }

  const handleRemoveTimeBlock = (dayId: number, blockId: string) => {
    const newConfig = { ...scheduleConfig }
    const currentBlocks = newConfig[dayId]?.timeBlocks || []
    
    if (currentBlocks.length > 1) {
      newConfig[dayId] = {
        ...newConfig[dayId],
        timeBlocks: currentBlocks.filter(block => block.id !== blockId)
      }
      updateScheduleConfig(newConfig)
    }
  }

  const handleUpdateTimeBlock = (dayId: number, blockId: string, field: 'openTime' | 'closeTime', value: string) => {
    const newConfig = { ...scheduleConfig }
    const currentBlocks = newConfig[dayId]?.timeBlocks || []
    
    newConfig[dayId] = {
      ...newConfig[dayId],
      timeBlocks: currentBlocks.map(block => 
        block.id === blockId 
          ? { ...block, [field]: value }
          : block
      )
    }
    
    updateScheduleConfig(newConfig)
  }

  const handleHourToggle = (hour: string) => {
    // Esta función se mantiene por compatibilidad pero no se usa en la versión actual
  }

  const handleCopySchedule = (fromDay: number, toDay: number) => {
    if (scheduleConfig[fromDay]) {
      const newConfig = { ...scheduleConfig }
      newConfig[toDay] = { ...scheduleConfig[fromDay] }
      updateScheduleConfig(newConfig)
    }
  }

  const handleAddSpecialDate = (date: string, type: 'closed' | 'special') => {
    if (!date) return
    addSpecialDate(date, type)
    setSelectedSpecialDate('')
  }

  const handleRemoveSpecialDate = (dateToRemove: string) => {
    removeSpecialDate(dateToRemove)
  }

  const handleSetAllDaysOpen = () => {
    const newConfig = { ...scheduleConfig }
    
    weekDays.forEach(day => {
      newConfig[day.id] = {
        isOpen: true,
        timeBlocks: [
          { id: '1', openTime: '09:00', closeTime: '12:00' },
          { id: '2', openTime: '14:00', closeTime: '18:00' }
        ],
        blockedHours: []
      }
    })
    
    updateScheduleConfig(newConfig)
  }

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
                <h1 className="text-2xl font-semibold text-gray-800">Horarios de Atención</h1>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200">
              <div className="flex space-x-4 px-4">
                <button
                  onClick={() => setActiveTab('weekly')}
                  className={`py-4 px-2 border-b-2 ${
                    activeTab === 'weekly'
                      ? 'border-[#006AFC] text-[#006AFC]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Horario Semanal
                </button>
                <button
                  onClick={() => setActiveTab('special')}
                  className={`py-4 px-2 border-b-2 ${
                    activeTab === 'special'
                      ? 'border-[#006AFC] text-[#006AFC]'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Fechas Especiales
                </button>
              </div>
            </div>

            {/* Contenido */}
            <div className="p-6">
              {/* Configuración de días máximos de reserva */}
              <div className="mb-8">
                <h2 className="text-lg font-medium text-gray-700 mb-4">Configuración de Reservas</h2>
                <div className="flex items-center space-x-4">
                  <label className="text-gray-600">Máximo de días para reservar con anticipación:</label>
                  <select
                    value={maxBookingDays}
                    onChange={(e) => updateMaxBookingDays(Number(e.target.value))}
                    className="w-32 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AFC]"
                  >
                    <option value="7">7 días</option>
                    <option value="15">15 días</option>
                    <option value="30">30 días</option>
                    <option value="60">60 días</option>
                    <option value="90">90 días</option>
                    <option value="180">180 días</option>
                    <option value="365">365 días</option>
                  </select>
                </div>
              </div>

              {activeTab === 'weekly' ? (
                <>
                  {/* Días de la semana */}
                  <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium text-gray-700">Días de Atención</h2>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSetAllDaysOpen}
                          className="px-3 py-1 text-sm bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                        >
                          Marcar Todos Abiertos
                        </button>
                        <button
                          onClick={handleSetAllDaysClosed}
                          className="px-3 py-1 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Marcar Todos Cerrados
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-7 gap-4">
                      {weekDays.map(day => {
                        const isConfigured = !!scheduleConfig[day.id]
                        const isOpen = scheduleConfig[day.id]?.isOpen || false
                        
                        return (
                          <div key={day.id} className="relative">
                            <div className="text-center">
                              <div className={`w-full p-3 rounded-lg border transition-colors ${
                                isConfigured
                                  ? isOpen
                                    ? 'bg-[#006AFC] text-white border-[#006AFC]'
                                    : 'bg-red-100 text-red-700 border-red-200'
                                  : 'bg-gray-100 text-gray-500 border-gray-200'
                              }`}>
                                {day.name}
                              </div>
                              <div className="mt-2 space-y-1">
                                {!isConfigured ? (
                                  <div className="text-xs text-gray-500">No configurado</div>
                                ) : isOpen ? (
                                  <div className="text-xs text-green-600 font-medium">Abierto</div>
                                ) : (
                                  <div className="text-xs text-red-600 font-medium">Cerrado</div>
                                )}
                              </div>
                              <div className="mt-2 space-y-1">
                                {!isConfigured ? (
                                  <div className="flex flex-col space-y-1">
                                    <button
                                      onClick={() => handleDaySetOpen(day.id)}
                                      className="px-2 py-1 text-xs bg-green-100 text-green-600 rounded hover:bg-green-200 transition-colors"
                                    >
                                      Marcar Abierto
                                    </button>
                                    <button
                                      onClick={() => handleDaySetClosed(day.id)}
                                      className="px-2 py-1 text-xs bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                                    >
                                      Marcar Cerrado
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleDayToggle(day.id)}
                                    className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                                  >
                                    Cambiar Estado
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Horarios por día */}
                  <div className="p-4">
                    <h2 className="text-lg font-medium text-gray-700 mb-4">Horarios por Día</h2>
                    <div className="space-y-6">
                      {weekDays.map(day => {
                        const dayId = day.id.toString()
                        // Si el día no está seleccionado, mostrar mensaje de cerrado
                        if (!scheduleConfig[day.id]?.isOpen) {
                          return (
                            <div key={day.id} className="flex items-center space-x-4 p-4 border border-red-100 rounded-lg bg-red-50">
                              <div className="w-32">
                                <span className="font-medium text-red-600">{day.name}</span>
                              </div>
                              <div className="flex-1">
                                <span className="text-red-500 italic">No se trabaja este día</span>
                              </div>
                            </div>
                          )
                        }

                        // Si el día está seleccionado, mostrar configuración de horarios
                        const timeBlocks = scheduleConfig[day.id]?.timeBlocks || [
                          { id: '1', openTime: '09:00', closeTime: '12:00' },
                          { id: '2', openTime: '14:00', closeTime: '18:00' }
                        ]

                        return (
                          <div key={day.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-4">
                              <span className="font-medium text-lg">{day.name}</span>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => handleAddTimeBlock(day.id)}
                                  className="px-3 py-1 text-sm bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors flex items-center space-x-1"
                                >
                                  <PlusIcon className="h-4 w-4" />
                                  <span>Agregar Bloque</span>
                                </button>
                                <button
                                  onClick={() => handleCopySchedule(day.id, (day.id % 7) + 1)}
                                  className="text-[#006AFC] hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg"
                                  title="Copiar al siguiente día"
                                >
                                  <ChevronRightIcon className="h-5 w-5" />
                                </button>
                              </div>
                            </div>
                            
                            <div className="space-y-3">
                              {timeBlocks.map((block, index) => (
                                <div key={block.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                                  <div className="flex items-center space-x-2">
                                    <span className="text-sm font-medium text-gray-600">
                                      Bloque {index + 1}:
                                    </span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <select
                                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AFC] text-sm"
                                      value={block.openTime}
                                      onChange={(e) => handleUpdateTimeBlock(day.id, block.id, 'openTime', e.target.value)}
                                    >
                                      {timeSlots.map(time => (
                                        <option key={time} value={time}>{time}</option>
                                      ))}
                                    </select>
                                    <span className="text-gray-500">a</span>
                                    <select
                                      className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AFC] text-sm"
                                      value={block.closeTime}
                                      onChange={(e) => handleUpdateTimeBlock(day.id, block.id, 'closeTime', e.target.value)}
                                    >
                                      {timeSlots.map(time => (
                                        <option key={time} value={time}>{time}</option>
                                      ))}
                                    </select>
                                  </div>
                                  {timeBlocks.length > 1 && (
                                    <button
                                      onClick={() => handleRemoveTimeBlock(day.id, block.id)}
                                      className="text-red-500 hover:text-red-700 transition-colors p-1 hover:bg-red-50 rounded"
                                      title="Eliminar bloque"
                                    >
                                      <TrashIcon className="h-4 w-4" />
                                    </button>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  {/* Calendario de fechas especiales */}
                  <div>
                    <h2 className="text-lg font-medium text-gray-700 mb-4">Fechas Especiales</h2>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-medium mb-2">Agregar Fecha Especial</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Seleccionar Fecha
                            </label>
                            <input
                              type="date"
                              value={selectedSpecialDate}
                              onChange={(e) => setSelectedSpecialDate(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AFC]"
                            />
                          </div>
                          {selectedSpecialDate && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleAddSpecialDate(selectedSpecialDate, 'closed')}
                                className="flex-1 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                              >
                                Marcar como Cerrado
                              </button>
                              <button
                                onClick={() => handleAddSpecialDate(selectedSpecialDate, 'special')}
                                className="flex-1 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                              >
                                Horario Especial
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="border border-gray-200 rounded-lg p-4">
                        <h3 className="font-medium mb-2">Fechas Especiales Programadas</h3>
                        <div className="space-y-2">
                          {specialDates.length === 0 ? (
                            <p className="text-gray-500 italic text-center py-4">
                              No hay fechas especiales programadas
                            </p>
                          ) : (
                            specialDates.map(({ date, type }) => (
                              <div key={date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-3">
                                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                                  <span className="font-medium">
                                    {new Date(date).toLocaleDateString('es-ES', {
                                      weekday: 'long',
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      timeZone: 'UTC'
                                    })}
                                  </span>
                                  <span className={`px-2 py-1 rounded text-sm ${
                                    type === 'closed' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                  }`}>
                                    {type === 'closed' ? 'Cerrado' : 'Horario Especial'}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleRemoveSpecialDate(date)}
                                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 hover:bg-gray-100 rounded-full"
                                  title="Eliminar fecha especial"
                                >
                                  <XMarkIcon className="h-5 w-5" />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}