'use client'

import { useState } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'
import { useSchedule } from '@/context/ScheduleContext'

// Generamos las horas de 7 AM a 2 PM (8 filas)
const timeSlots = Array.from({ length: 8 }, (_, i) => {
  const hour = i + 7 // Empezamos a las 7 AM
  return `${hour.toString().padStart(2, '0')}:00`
})

// Servicios disponibles
const services = [
  { id: 1, name: 'Corte de pelo', duration: '1h' },
  { id: 2, name: 'Corte de barba', duration: '1h' }
]

// Tipo para las reservas
type Reservation = {
  id: string
  name: string
  service: string
  duration: string
  email: string
  phone: string
  time: string
  date: Date
}

export default function Calendar({ userName }: { userName: string }) {
  const { scheduleConfig, specialDates, maxBookingDays } = useSchedule()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCell, setSelectedCell] = useState<{ time: string; day: number } | null>(null)
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [formData, setFormData] = useState({
    name: '',
    service: '',
    email: '',
    phone: ''
  })

  // Función para verificar si una fecha está dentro del rango permitido
  const isDateWithinRange = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Resetear la hora a inicio del día
    
    const maxDate = new Date(today)
    maxDate.setDate(today.getDate() + maxBookingDays)
    
    return date >= today && date <= maxDate
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  // Función para obtener las fechas de la semana actual
  const getWeekDates = (date: Date) => {
    const startDate = new Date(date)
    
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startDate)
      day.setDate(startDate.getDate() + i)
      return day
    })
  }

  const addDays = (days: number) => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + days)
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
    const dateString = date.toISOString().split('T')[0]
    const specialDate = specialDates.find(sd => sd.date === dateString)
    
    if (specialDate) {
      return specialDate.type === 'special' // Si es tipo 'closed', retorna false
    }

    // Si no es fecha especial, verificar el horario normal
    const dayOfWeek = date.getDay() || 7 // Convertir domingo (0) a 7
    return scheduleConfig[dayOfWeek]?.isOpen ?? false
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCell) return

    const selectedService = services.find(s => s.name === formData.service)
    if (!selectedService) return

    // Obtener la fecha correspondiente al día seleccionado
    const weekDates = getWeekDates(currentDate)
    const selectedDate = weekDates[selectedCell.day]

    const newReservation: Reservation = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      service: formData.service,
      duration: selectedService.duration,
      email: formData.email,
      phone: formData.phone,
      time: selectedCell.time,
      date: selectedDate
    }

    setReservations([...reservations, newReservation])
    setIsModalOpen(false)
    setFormData({ name: '', service: '', email: '', phone: '' })
  }

  const getReservationForCell = (time: string, dayIndex: number) => {
    const weekDates = getWeekDates(currentDate)
    const cellDate = weekDates[dayIndex]
    
    return reservations.find(r => {
      const reservationDate = new Date(r.date)
      return r.time === time && 
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
    setFormData({ name: '', service: '', email: '', phone: '' })
  }

  return (
    <div className="flex-1">
      <div className="h-[15px] bg-gray-50"></div>
      <div className="bg-white mx-2 rounded-lg border border-gray-200">
        {/* Encabezado */}
        <div className="border-b border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center p-2 space-y-2 sm:space-y-0">
            <h1 className="text-2xl font-semibold text-gray-800">Reservas</h1>
            <button className="flex items-center space-x-2 px-3 py-1.5 hover:bg-gray-50 rounded-lg border border-gray-200 w-full sm:w-auto justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                <path d="M3.75 15.8113V15.0613C3.75 12.1618 6.1005 9.81127 9 9.81127V9.81127C11.8995 9.81127 14.25 12.1618 14.25 15.0613V15.8113" stroke="#2C3442" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 9.81127C10.6569 9.81127 12 8.46813 12 6.81127C12 5.15442 10.6569 3.81127 9 3.81127C7.34315 3.81127 6 5.15442 6 6.81127C6 8.46813 7.34315 9.81127 9 9.81127Z" stroke="#2C3442" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="text-gray-700">{userName}</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                <path d="M4.5 7.56127L9 12.0613L13.5 7.56127" stroke="#475163" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
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
                className="flex items-center px-3 py-1.5 bg-[#006AFC] text-white rounded-lg hover:bg-blue-600 border border-[#006AFC] w-full sm:w-auto justify-center"
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

          {/* Calendario */}
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
                          
                          return (
                            <td 
                              key={dayIndex} 
                              className={`w-[180px] h-[120px] border-r border-gray-200 last:border-r-0 ${
                                isOpen ? 'hover:bg-gray-50' : 'bg-red-50'
                              } group relative ${isOpen ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                              onClick={() => isOpen && handleCellClick(time, dayIndex)}
                            >
                              {reservation ? (
                                <div className="p-1.5">
                                  <div className="bg-white rounded-lg border border-gray-200 p-2 h-[110px] flex flex-col">
                                    <div className="font-medium text-gray-900 mb-2 truncate">{reservation.name}</div>
                                    <div className="bg-[#006AFC] text-white text-sm px-1.5 py-0.5 rounded-md inline-block self-start truncate">
                                      {reservation.service}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-auto">{reservation.duration}</div>
                                  </div>
                                </div>
                              ) : isOpen ? (
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
                {!selectedCell && (
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
                        {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((day, index) => (
                          <option key={day} value={index}>
                            {day}
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
                        {timeSlots.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
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
                    Servicio
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AFC] focus:border-transparent"
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  >
                    <option value="">Seleccionar servicio</option>
                    {services.map((service) => (
                      <option key={service.id} value={service.name}>
                        {service.name} ({service.duration})
                      </option>
                    ))}
                  </select>
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