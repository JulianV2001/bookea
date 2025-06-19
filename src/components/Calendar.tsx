'use client'

import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, XMarkIcon, ChevronDownIcon } from '@heroicons/react/24/outline'
import { useSchedule } from '@/context/ScheduleContext'
import { useServices, Service, TimeSlot } from '@/context/ServicesContext'

// Tipo para las reservas
type Reservation = {
  id: string
  name: string
  serviceId: string
  serviceName: string
  duration: string
  email: string
  phone: string
  time: string
  date: Date
}

export default function Calendar({ userName }: { userName: string }) {
  const { scheduleConfig, specialDates, maxBookingDays, isLoading } = useSchedule()
  const { services, generateTimeSlots } = useServices()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCell, setSelectedCell] = useState<{ time: string; day: number } | null>(null)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [formData, setFormData] = useState({
    name: '',
    serviceId: '',
    email: '',
    phone: ''
  })
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([])
  const [showServiceDropdown, setShowServiceDropdown] = useState(false)

  // Mostrar loading mientras se cargan los datos
  if (isLoading) {
    return (
      <div className="flex-1">
        <div className="h-[15px] bg-gray-50"></div>
        <div className="bg-white mx-2 rounded-lg border border-gray-200">
          <div className="flex items-center justify-center p-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006AFC] mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando configuración de horarios...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Función para verificar si una fecha está dentro del rango permitido
  const isDateWithinRange = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Resetear la hora a inicio del día
    
    const maxDate = new Date(today)
    maxDate.setDate(today.getDate() + maxBookingDays)
    
    // Resetear la hora de la fecha a verificar para comparación correcta
    const checkDate = new Date(date)
    checkDate.setHours(0, 0, 0, 0)
    
    return checkDate >= today && checkDate <= maxDate
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  // Función helper para obtener la fecha en formato YYYY-MM-DD sin problemas de zona horaria
  const getDateString = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Función para obtener las fechas de la semana actual
  const getWeekDates = (date: Date) => {
    const startDate = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Si la fecha de inicio está en el pasado, usar hoy
    if (startDate < today) {
      startDate.setTime(today.getTime())
    }
    
    // Generar las 7 fechas consecutivas empezando desde la fecha seleccionada
    const weekDates = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startDate)
      day.setDate(startDate.getDate() + i)
      return day
    })
    
    return weekDates
  }

  const addDays = (days: number) => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + days) // Navegar por días individuales
    setCurrentDate(newDate)
  }

  const showToday = () => {
    setCurrentDate(new Date())
  }

  const isDayOpen = (date: Date) => {
    // Primero verificar si la fecha está dentro del rango permitido
    if (!isDateWithinRange(date)) {
      return false
    }

    // Luego verificar si es una fecha especial
    const dateString = getDateString(date)
    const specialDate = specialDates.find(sd => sd.date === dateString)
    
    if (specialDate) {
      return specialDate.type === 'special' // Si es tipo 'closed', retorna false
    }

    // Si no es fecha especial, verificar el horario normal
    // getDay() devuelve: 0=domingo, 1=lunes, 2=martes, etc.
    // Nuestro contexto usa: 1=lunes, 2=martes, ..., 7=domingo
    const dayOfWeek = new Date(date).getDay()
    const dayId = dayOfWeek === 0 ? 7 : dayOfWeek // Convertir domingo de 0 a 7
    
    // Si el día no está configurado, considerarlo como cerrado
    const daySchedule = scheduleConfig[dayId]
    if (!daySchedule) {
      return false
    }
    
    return daySchedule.isOpen
  }

  // Función para obtener los turnos disponibles para un servicio en una fecha específica
  const getAvailableTimeSlotsForService = (serviceId: string, date: string): TimeSlot[] => {
    return generateTimeSlots(serviceId, date)
  }

  // Función para obtener todos los turnos disponibles para la semana actual
  const getAllTimeSlotsForWeek = () => {
    if (!selectedService) return []
    
    const weekDates = getWeekDates(currentDate)
    const allSlots: { [key: string]: TimeSlot[] } = {}
    
    weekDates.forEach((date, index) => {
      const dateString = getDateString(date)
      const slots = getAvailableTimeSlotsForService(selectedService.id, dateString)
      allSlots[index] = slots
    })
    
    return allSlots
  }

  const handleCellClick = (time: string, day: number) => {
    const weekDates = getWeekDates(currentDate)
    const selectedDate = weekDates[day]
    
    if (!isDayOpen(selectedDate)) {
      return // No permitir reservas en días cerrados
    }
    
    setSelectedCell({ time, day })
    setIsModalOpen(true)
  }

  const handleServiceChange = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId)
    setSelectedService(service || null)
    setFormData({ ...formData, serviceId })
    setShowServiceDropdown(false)
    
    if (service) {
      // Generar turnos disponibles para la semana actual
      const weekDates = getWeekDates(currentDate)
      const allSlots: TimeSlot[] = []
      
      weekDates.forEach(date => {
        const dateString = getDateString(date)
        const slots = getAvailableTimeSlotsForService(service.id, dateString)
        allSlots.push(...slots)
      })
      
      setAvailableTimeSlots(allSlots)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCell || !selectedService) return

    // Obtener la fecha correspondiente al día seleccionado
    const weekDates = getWeekDates(currentDate)
    const selectedDate = weekDates[selectedCell.day]

    const newReservation: Reservation = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      duration: selectedService.durationInterval,
      email: formData.email,
      phone: formData.phone,
      time: selectedCell.time,
      date: selectedDate
    }

    setReservations([...reservations, newReservation])
    setIsModalOpen(false)
    setFormData({ name: '', serviceId: '', email: '', phone: '' })
    setSelectedService(null)
  }

  const getReservationForCell = (time: string, dayIndex: number) => {
    if (!selectedService) return null
    
    const weekDates = getWeekDates(currentDate)
    const cellDate = weekDates[dayIndex]
    
    return reservations.find(r => {
      const reservationDate = new Date(r.date)
      return r.serviceId === selectedService.id &&
             r.time === time && 
             reservationDate.getDate() === cellDate.getDate() &&
             reservationDate.getMonth() === cellDate.getMonth() &&
             reservationDate.getFullYear() === cellDate.getFullYear()
    })
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCell(null)
    setSelectedDay(null)
    setSelectedTime(null)
    setFormData({ name: '', serviceId: '', email: '', phone: '' })
    setSelectedService(null)
  }

  // Obtener todos los turnos únicos para mostrar en el calendario
  const getAllUniqueTimeSlots = () => {
    if (!selectedService) return []
    
    const weekDates = getWeekDates(currentDate)
    const allSlots: Set<string> = new Set()
    
    weekDates.forEach(date => {
      const dateString = getDateString(date)
      const slots = getAvailableTimeSlotsForService(selectedService.id, dateString)
      slots.forEach(slot => {
        allSlots.add(slot.startTime)
      })
    })
    
    return Array.from(allSlots).sort()
  }

  const timeSlots = selectedService ? getAllUniqueTimeSlots() : []

  return (
    <div className="flex-1">
      <div className="h-[15px] bg-gray-50"></div>
      <div className="bg-white mx-2 rounded-lg border border-gray-200">
        {/* Encabezado */}
        <div className="border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center p-2 space-y-2 sm:space-y-0">
            <h1 className="text-2xl font-semibold text-gray-800">Reservas</h1>
            <div className="relative">
              <button 
                onClick={() => setShowServiceDropdown(!showServiceDropdown)}
                className="flex items-center space-x-2 px-3 py-1.5 hover:bg-gray-50 rounded-lg border border-gray-200 w-full sm:w-auto justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                  <path d="M3.75 15.8113V15.0613C3.75 12.1618 6.1005 9.81127 9 9.81127V9.81127C11.8995 9.81127 14.25 12.1618 14.25 15.0613V15.8113" stroke="#2C3442" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 9.81127C10.6569 9.81127 12 8.46813 12 6.81127C12 5.15442 10.6569 3.81127 9 3.81127C7.34315 3.81127 6 5.15442 6 6.81127C6 8.46813 7.34315 9.81127 9 9.81127Z" stroke="#2C3442" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-gray-700">
                  {selectedService ? selectedService.name : 'Seleccionar Servicio'}
                </span>
                <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${showServiceDropdown ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Dropdown de servicios */}
              {showServiceDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                  <div className="p-2">
                    {services.length === 0 ? (
                      <div className="p-3 text-center text-gray-500">
                        No hay servicios disponibles
                      </div>
                    ) : (
                      services.map((service) => (
                        <button
                          key={service.id}
                          onClick={() => handleServiceChange(service.id)}
                          className={`w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors ${
                            selectedService?.id === service.id ? 'bg-blue-50 text-blue-600' : ''
                          }`}
                        >
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 ${
                            service.type === 'sport' ? 'bg-blue-100' : 
                            service.type === 'consultation' ? 'bg-green-100' : 'bg-pink-100'
                          }`}>
                            {service.type === 'sport' ? (
                              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                            ) : service.type === 'consultation' ? (
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                              </svg>
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{service.name}</div>
                            <div className="text-sm text-gray-500">{service.durationInterval}</div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contenido del calendario */}
        <div className="p-2">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 mb-4">
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button 
                onClick={() => {
                  setSelectedCell(null)
                  setIsModalOpen(true)
                }}
                disabled={!selectedService}
                className="flex items-center px-3 py-1.5 bg-[#006AFC] text-white rounded-lg hover:bg-blue-600 border border-[#006AFC] w-full sm:w-auto justify-center disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Añadir reserva
              </button>
              <button 
                onClick={showToday}
                className="px-3 py-1.5 text-gray-700 bg-white rounded-lg hover:bg-gray-50 border border-gray-200 w-full sm:w-auto"
              >
                Mostrar hoy
              </button>
            </div>

            <div className="flex items-center space-x-4 w-full sm:w-auto justify-center">
              <div className="flex items-center border border-gray-200 rounded-lg">
                <button onClick={() => addDays(-1)} className="p-2 hover:bg-gray-50 border-r border-gray-200">
                  <ChevronLeftIcon className="h-5 w-5 text-[#006AFC]" />
                </button>
                <div className="flex items-center px-4 py-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" className="mr-2">
                    <path d="M14.25 3.31127H3.75C2.92157 3.31127 2.25 3.98284 2.25 4.81127V15.3113C2.25 16.1397 2.92157 16.8113 3.75 16.8113H14.25C15.0784 16.8113 15.75 16.1397 15.75 15.3113V4.81127C15.75 3.98284 15.0784 3.31127 14.25 3.31127Z" stroke="#2C3442" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 1.81127V4.81127" stroke="#2C3442" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M6 1.81127V4.81127" stroke="#2C3442" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2.25 7.81127H15.75" stroke="#2C3442" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-gray-700">{formatDate(currentDate)}</span>
                </div>
                <button onClick={() => addDays(1)} className="p-2 hover:bg-gray-50 border-l border-gray-200">
                  <ChevronRightIcon className="h-5 w-5 text-[#006AFC]" />
                </button>
              </div>
            </div>
          </div>

          {/* Línea divisoria */}
          <div className="border-b border-gray-200"></div>

          {/* Mensaje cuando no hay servicio seleccionado */}
          {!selectedService && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Selecciona un servicio</h3>
              <p className="text-gray-600 mb-6">Elige un servicio o cancha para ver las reservas</p>
              <button
                onClick={() => setShowServiceDropdown(true)}
                className="px-6 py-3 bg-[#006AFC] text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Seleccionar Servicio
              </button>
            </div>
          )}

          {/* Calendario */}
          {selectedService && (
            <div className="overflow-x-auto">
              <div className="flex min-w-[800px] pt-4">
                {/* Time slots a la izquierda */}
                <div className="w-16 pt-8">
                  {timeSlots.map((time) => (
                    <div key={time} className="h-[120px] flex items-center justify-end pr-2 text-sm text-gray-600">
                      {time}
                    </div>
                  ))}
                </div>

                {/* Cuadrícula del calendario */}
                <div className="flex-1 border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        {getWeekDates(currentDate).map((date, index) => (
                          <th 
                            key={index} 
                            className={`w-[180px] py-4 px-2 text-center text-sm font-medium border-b border-r border-gray-200 last:border-r-0 ${
                              isDayOpen(date) ? 'bg-gray-50 text-gray-600' : 'bg-red-50 text-red-600'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row items-center justify-center space-y-1 sm:space-y-0 sm:space-x-1">
                              <span className={`capitalize ${isDayOpen(date) ? 'text-gray-600' : 'text-red-600'}`}>
                                {date.toLocaleDateString('es-ES', { weekday: 'short' })}
                              </span>
                              <span className={isDayOpen(date) ? 'text-gray-600' : 'text-red-600'}>.</span>
                              <span className={isDayOpen(date) ? 'text-gray-900' : 'text-red-600'}>
                                {date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })}
                              </span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timeSlots.map((time) => (
                        <tr key={time} className="border-b border-gray-200 last:border-b-0">
                          {Array.from({ length: 7 }).map((_, dayIndex) => {
                            const weekDates = getWeekDates(currentDate)
                            const cellDate = weekDates[dayIndex]
                            const isOpen = isDayOpen(cellDate)
                            const reservation = getReservationForCell(time, dayIndex)
                            
                            // Verificar si este turno está disponible para el servicio seleccionado
                            const isTimeSlotAvailable = selectedService ? (() => {
                              // Usar un método más confiable para obtener la fecha sin problemas de zona horaria
                              const year = cellDate.getFullYear()
                              const month = String(cellDate.getMonth() + 1).padStart(2, '0')
                              const day = String(cellDate.getDate()).padStart(2, '0')
                              const dateString = `${year}-${month}-${day}`
                              
                              const availableSlots = getAvailableTimeSlotsForService(selectedService.id, dateString)
                              const isAvailable = availableSlots.some(slot => slot.startTime === time)
                              
                              return isAvailable
                            })() : false
                            
                            return (
                              <td 
                                key={dayIndex} 
                                className={`w-[180px] h-[120px] border-r border-gray-200 last:border-r-0 ${
                                  isOpen && isTimeSlotAvailable ? 'hover:bg-gray-50' : 'bg-red-50'
                                } group relative ${isOpen && isTimeSlotAvailable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                onClick={() => isOpen && isTimeSlotAvailable && handleCellClick(time, dayIndex)}
                              >
                                {reservation ? (
                                  <div className="p-1.5">
                                    <div className="bg-white rounded-lg border border-gray-200 p-2 h-[110px] flex flex-col">
                                      <div className="font-medium text-gray-900 mb-2 truncate">{reservation.name}</div>
                                      <div className="bg-[#006AFC] text-white text-sm px-1.5 py-0.5 rounded-md inline-block self-start truncate">
                                        {reservation.serviceName}
                                      </div>
                                      <div className="text-xs text-gray-500 mt-auto">{reservation.duration}</div>
                                    </div>
                                  </div>
                                ) : isOpen && isTimeSlotAvailable ? (
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="text-center">
                                      <div className="text-gray-600 text-2xl font-medium">+</div>
                                      <div className="text-gray-600 text-sm font-medium">Agregar reserva</div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                      <div className="text-red-400 text-sm font-medium">No disponible</div>
                                    </div>
                                  </div>
                                )}
                              </td>
                            )
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de reserva */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-[500px] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Nueva Reserva</h2>
              <button 
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Servicio
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AFC] focus:border-transparent"
                    value={formData.serviceId}
                    onChange={(e) => handleServiceChange(e.target.value)}
                  >
                    <option value="">Seleccionar servicio</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name} ({service.durationInterval})
                      </option>
                    ))}
                  </select>
                </div>

                {!selectedCell && selectedService && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Día
                      </label>
                      <select
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AFC] focus:border-transparent"
                        value={selectedDay?.toString() || ""}
                        onChange={(e) => {
                          const day = parseInt(e.target.value)
                          setSelectedDay(day)
                          if (selectedTime) {
                            setSelectedCell({ time: selectedTime, day })
                          }
                        }}
                      >
                        <option value="">Seleccionar día</option>
                        {getWeekDates(currentDate).map((date, index) => (
                          <option key={index} value={index} disabled={!isDayOpen(date)}>
                            {date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'short' })}
                            {!isDayOpen(date) ? ' (Cerrado)' : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hora
                      </label>
                      <select
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AFC] focus:border-transparent"
                        value={selectedTime || ""}
                        onChange={(e) => {
                          const time = e.target.value
                          setSelectedTime(time)
                          if (selectedDay !== null) {
                            setSelectedCell({ time, day: selectedDay })
                          }
                        }}
                      >
                        <option value="">Seleccionar hora</option>
                        {selectedDay !== null && selectedService ? (() => {
                          const weekDates = getWeekDates(currentDate)
                          const selectedDate = weekDates[selectedDay]
                          const dateString = getDateString(selectedDate)
                          const slots = getAvailableTimeSlotsForService(selectedService.id, dateString)
                          return slots.map(slot => (
                            <option key={slot.id} value={slot.startTime}>
                              {slot.startTime} - {slot.endTime}
                            </option>
                          ))
                        })() : []}
                      </select>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre y Apellido
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AFC] focus:border-transparent"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AFC] focus:border-transparent"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AFC] focus:border-transparent"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-[#006AFC] rounded-lg hover:bg-blue-600"
                >
                  Crear Reserva
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
} 