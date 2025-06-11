'use client'

import { useState } from 'react'
import DashboardHeader from '@/components/DashboardHeader'
import Sidebar from '@/components/Sidebar'
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, XMarkIcon, CalendarIcon, ClockIcon } from '@heroicons/react/24/outline'
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

// Intervalos de tiempo
const timeIntervals = ['30 min', '1 hora', '1.5 horas', '2 horas']

type DaySchedule = {
  isOpen: boolean
  openTime: string
  closeTime: string
  intervals: string[]
  blockedHours: string[]
}

type ScheduleConfig = {
  [key: number]: DaySchedule
}

export default function HorariosPage() {
  const { scheduleConfig, updateScheduleConfig, specialDates, addSpecialDate, removeSpecialDate, maxBookingDays, updateMaxBookingDays } = useSchedule()
  const [selectedDays, setSelectedDays] = useState<number[]>([])
  const [selectedHours, setSelectedHours] = useState<string[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'weekly' | 'special'>('weekly')
  const [globalIntervals, setGlobalIntervals] = useState<string[]>([])
  const [selectedSpecialDate, setSelectedSpecialDate] = useState<string>('')

  // Función para generar horarios basados en intervalos
  const generateTimeSlots = (intervals: string[]) => {
    const slots: string[] = []
    const startHour = 7 // 7 AM
    const endHour = 22 // 10 PM

    intervals.forEach(interval => {
      const minutes = interval === '30 min' ? 30 :
                     interval === '1 hora' ? 60 :
                     interval === '1.5 horas' ? 90 : 120

      for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += minutes) {
          const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
          if (!slots.includes(time)) {
            slots.push(time)
          }
        }
      }
    })

    return slots.sort()
  }

  // Función para actualizar horarios cuando cambian los intervalos
  const updateTimeSlots = (intervals: string[]) => {
    const newTimeSlots = generateTimeSlots(intervals)
    setGlobalIntervals(intervals)

    // Actualizar la configuración de horarios para mantener solo los slots válidos
    const newConfig = { ...scheduleConfig }
    Object.keys(newConfig).forEach(dayId => {
      const dayConfig = newConfig[Number(dayId)]
      if (dayConfig) {
        // Encontrar el slot más cercano para la hora de apertura
        const openTime = newTimeSlots.find(time => time >= dayConfig.openTime) || newTimeSlots[0]
        // Encontrar el slot más cercano para la hora de cierre
        const closeTime = newTimeSlots.find(time => time <= dayConfig.closeTime) || newTimeSlots[newTimeSlots.length - 1]

        newConfig[Number(dayId)] = {
          ...dayConfig,
          openTime,
          closeTime,
          intervals: dayConfig.intervals || [],
          blockedHours: dayConfig.blockedHours || []
        }
      }
    })
    updateScheduleConfig(newConfig)
  }

  const handleDayToggle = (dayId: number) => {
    setSelectedDays(prev => 
      prev.includes(dayId) 
        ? prev.filter(id => id !== dayId)
        : [...prev, dayId]
    )
  }

  const handleHourToggle = (hour: string) => {
    setSelectedHours(prev =>
      prev.includes(hour)
        ? prev.filter(h => h !== hour)
        : [...prev, hour]
    )
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

  const handleSaveChanges = () => {
    const newConfig: ScheduleConfig = {}
    weekDays.forEach(day => {
      newConfig[day.id] = {
        isOpen: selectedDays.includes(day.id),
        openTime: scheduleConfig[day.id]?.openTime || '09:00',
        closeTime: scheduleConfig[day.id]?.closeTime || '18:00',
        intervals: scheduleConfig[day.id]?.intervals || [],
        blockedHours: scheduleConfig[day.id]?.blockedHours || []
      }
    })
    updateScheduleConfig(newConfig)
    setIsEditing(false)
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
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => {
                      if (!isEditing) {
                        // Al entrar en modo edición, cargar los días que ya están configurados
                        const openDays = weekDays
                          .filter(day => scheduleConfig[day.id]?.isOpen)
                          .map(day => day.id)
                        setSelectedDays(openDays)
                      } else {
                        handleSaveChanges()
                      }
                      setIsEditing(!isEditing)
                    }}
                    className="px-4 py-2 bg-[#006AFC] text-white rounded-lg hover:bg-blue-600"
                  >
                    {isEditing ? 'Guardar Cambios' : 'Editar Horarios'}
                  </button>
                </div>
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
                    <h2 className="text-lg font-medium text-gray-700 mb-4">Días de Atención</h2>
                    <div className="grid grid-cols-7 gap-4">
                      {weekDays.map(day => (
                        <div key={day.id} className="relative">
                          <button
                            onClick={() => isEditing && handleDayToggle(day.id)}
                            className={`w-full p-3 rounded-lg border ${
                              selectedDays.includes(day.id)
                                ? 'bg-[#006AFC] text-white border-[#006AFC]'
                                : 'bg-white text-gray-700 border-gray-200 hover:border-[#006AFC]'
                            } ${!isEditing && 'cursor-default'}`}
                          >
                            {day.name}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Configuración de Intervalos */}
                  <div className="mb-8">
                    <h2 className="text-lg font-medium text-gray-700 mb-4">Intervalos de Tiempo</h2>
                    <div className="grid grid-cols-4 gap-4">
                      {timeIntervals.map(interval => (
                        <button
                          key={interval}
                          onClick={() => isEditing && updateTimeSlots(
                            globalIntervals.includes(interval)
                              ? globalIntervals.filter(i => i !== interval)
                              : [...globalIntervals, interval]
                          )}
                          className={`p-3 rounded-lg border ${
                            globalIntervals.includes(interval)
                              ? 'bg-[#006AFC] text-white border-[#006AFC]'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-[#006AFC]'
                          } ${!isEditing && 'cursor-default'}`}
                        >
                          {interval}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Horarios por día */}
                  <div className="p-4">
                    <h2 className="text-lg font-medium text-gray-700 mb-4">Horarios por Día</h2>
                    <div className="space-y-4">
                      {weekDays.map(day => {
                        const dayId = day.id.toString()
                        // Si el día no está seleccionado, mostrar mensaje de cerrado
                        if (!selectedDays.includes(day.id)) {
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
                        return (
                          <div key={day.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                            <div className="w-32">
                              <span className="font-medium">{day.name}</span>
                            </div>
                            <div className="flex-1 flex items-center space-x-4">
                              <select
                                className="px-3 py-2 border border-gray-200 rounded-lg"
                                value={scheduleConfig[day.id]?.openTime || '09:00'}
                                onChange={(e) => {
                                  const newConfig = { ...scheduleConfig }
                                  newConfig[day.id] = {
                                    ...newConfig[day.id],
                                    openTime: e.target.value,
                                    intervals: newConfig[day.id]?.intervals || [],
                                    blockedHours: newConfig[day.id]?.blockedHours || []
                                  }
                                  updateScheduleConfig(newConfig)
                                }}
                              >
                                {generateTimeSlots(globalIntervals).map(time => (
                                  <option key={time} value={time}>{time}</option>
                                ))}
                              </select>
                              <span>a</span>
                              <select
                                className="px-3 py-2 border border-gray-200 rounded-lg"
                                value={scheduleConfig[day.id]?.closeTime || '18:00'}
                                onChange={(e) => {
                                  const newConfig = { ...scheduleConfig }
                                  newConfig[day.id] = {
                                    ...newConfig[day.id],
                                    closeTime: e.target.value,
                                    intervals: newConfig[day.id]?.intervals || [],
                                    blockedHours: newConfig[day.id]?.blockedHours || []
                                  }
                                  updateScheduleConfig(newConfig)
                                }}
                              >
                                {generateTimeSlots(globalIntervals).map(time => (
                                  <option key={time} value={time}>{time}</option>
                                ))}
                              </select>
                              {isEditing && (
                                <button
                                  onClick={() => handleCopySchedule(day.id, (day.id % 7) + 1)}
                                  className="text-[#006AFC] hover:text-blue-600"
                                  title="Copiar al siguiente día"
                                >
                                  <ChevronRightIcon className="h-5 w-5" />
                                </button>
                              )}
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