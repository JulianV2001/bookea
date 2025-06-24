'use client'

import { useState, useEffect } from 'react'
import { ChevronLeftIcon, ChevronRightIcon, PlusIcon, XMarkIcon, ChevronDownIcon, UserIcon } from '@heroicons/react/24/outline'
import { useSchedule } from '@/context/ScheduleContext'
import { useServices, Service, TimeSlot } from '@/context/ServicesContext'
import { useStaff, Staff } from '@/context/StaffContext'

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
  staffId?: string // Nueva propiedad para el personal asignado
}

export default function Calendar({ userName }: { userName: string }) {
  const { scheduleConfig, specialDates, maxBookingDays, isLoading } = useSchedule()
  const { services, generateTimeSlots } = useServices()
  const { staff, getStaffReservations, addStaffReservation } = useStaff()
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
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null)
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([])
  const [showServiceDropdown, setShowServiceDropdown] = useState(false)
  const [showStaffDropdown, setShowStaffDropdown] = useState(false)
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDateForPicker, setSelectedDateForPicker] = useState('')
  const [selectedStaffId, setSelectedStaffId] = useState('')

  // Cerrar calendario desplegable cuando se hace click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (showDatePicker && !target.closest('.date-picker-container')) {
        setShowDatePicker(false)
        setSelectedDateForPicker('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showDatePicker])

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
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
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

  const handleDatePickerChange = (dateString: string) => {
    if (dateString) {
      const newDate = new Date(dateString)
      setCurrentDate(newDate)
      setShowDatePicker(false)
      setSelectedDateForPicker('')
    }
  }

  // Obtener personal disponible para un servicio
  const getAvailableStaffForService = (serviceId: string) => {
    return staff.filter(member => member.services.includes(serviceId))
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
    
    // Resetear el personal seleccionado cuando cambie el servicio
    setSelectedStaff(null)
    setSelectedStaffId('')
    setShowStaffDropdown(false)
    
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

    // Si hay personal seleccionado, guardar en el contexto del personal
    if (selectedStaff) {
      // Crear una nueva fecha sin problemas de zona horaria
      const year = selectedDate.getFullYear()
      const month = selectedDate.getMonth()
      const day = selectedDate.getDate()
      const cleanDate = new Date(year, month, day)
      
      const newStaffReservation = {
        id: Math.random().toString(36).substr(2, 9),
        clientName: formData.name,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        duration: selectedService.durationInterval,
        clientEmail: formData.email,
        clientPhone: formData.phone,
        time: selectedCell.time,
        date: cleanDate,
        staffId: selectedStaff.id
      }
      
      addStaffReservation(newStaffReservation)
    } else {
      // Si no hay personal, guardar en reservas generales
      const newReservation: Reservation = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.name,
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        duration: selectedService.durationInterval,
        email: formData.email,
        phone: formData.phone,
        time: selectedCell.time,
        date: selectedDate,
        staffId: selectedStaffId || undefined
      }

      setReservations([...reservations, newReservation])
    }

    setIsModalOpen(false)
    setFormData({ name: '', serviceId: '', email: '', phone: '' })
    setSelectedService(null)
    setSelectedStaffId('')
  }

  const getReservationForCell = (time: string, dayIndex: number) => {
    if (!selectedService) return null
    
    const weekDates = getWeekDates(currentDate)
    const cellDate = weekDates[dayIndex]
    
    // Si hay personal seleccionado, buscar en sus reservas
    if (selectedStaff) {
      const dateString = getDateString(cellDate)
      const staffReservations = getStaffReservations(selectedStaff.id, dateString)
      const staffReservation = staffReservations.find(r => r.time === time && r.serviceId === selectedService.id)
      if (staffReservation) {
        return {
          id: staffReservation.id,
          name: staffReservation.clientName,
          serviceId: staffReservation.serviceId,
          serviceName: staffReservation.serviceName,
          duration: staffReservation.duration,
          email: staffReservation.clientEmail,
          phone: staffReservation.clientPhone,
          time: staffReservation.time,
          date: staffReservation.date,
          staffId: staffReservation.staffId
        }
      }
      return null
    }
    
    // Si no hay personal seleccionado, buscar en reservas generales
    return reservations.find(r => {
      // Convertir la fecha de la reserva a string para comparación consistente
      const reservationDate = new Date(r.date)
      const reservationDateString = reservationDate.toISOString().split('T')[0]
      const cellDateString = getDateString(cellDate)
      
      return r.serviceId === selectedService.id &&
             r.time === time && 
             reservationDateString === cellDateString
    })
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCell(null)
    setSelectedDay(null)
    setSelectedTime(null)
    setFormData({ name: '', serviceId: '', email: '', phone: '' })
    setSelectedService(null)
    setSelectedStaff(null)
    setSelectedStaffId('')
    setShowStaffDropdown(false)
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
                {selectedService ? (
                  <div className={`w-5 h-5 rounded flex items-center justify-center ${
                    selectedService.type === 'sport' ? 'bg-blue-100' : 
                    selectedService.type === 'consultation' ? 'bg-green-100' : 'bg-pink-100'
                  }`}>
                    {selectedService.type === 'sport' ? (
                      <svg className="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                    ) : selectedService.type === 'consultation' ? (
                      <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    ) : (
                      <svg className="w-3 h-3 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    )}
                  </div>
                ) : null}
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

            {/* Indicador de personal seleccionado */}
            {selectedStaff && selectedService?.needsStaff && (
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <button
                    onClick={() => setShowStaffDropdown(!showStaffDropdown)}
                    className="flex items-center px-3 py-1.5 text-gray-700 bg-white rounded-lg hover:bg-gray-50 border border-gray-200"
                  >
                    <UserIcon className="h-4 w-4 text-gray-600 mr-2" />
                    <span className="text-gray-700">
                      {selectedStaff.name} - {selectedStaff.position}
                    </span>
                    <ChevronDownIcon className={`h-4 w-4 ml-2 transition-transform duration-200 ${showStaffDropdown ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Dropdown para cambiar personal */}
                  {showStaffDropdown && selectedService && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <div className="p-2">
                        {getAvailableStaffForService(selectedService.id).map((member) => (
                          <button
                            key={member.id}
                            onClick={() => {
                              setSelectedStaff(member)
                              setShowStaffDropdown(false)
                            }}
                            className={`w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors ${
                              member.id === selectedStaff?.id ? 'bg-blue-50 text-blue-600' : ''
                            }`}
                          >
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <UserIcon className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">{member.name}</div>
                              <div className="text-sm text-gray-500">{member.position}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setSelectedStaff(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Limpiar selección de personal"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="flex items-center space-x-4 w-full sm:w-auto justify-center">
              <div className="flex items-center border border-gray-200 rounded-lg w-[320px]">
                <button onClick={() => addDays(-1)} className="p-2 hover:bg-gray-50 border-r border-gray-200 w-12 flex justify-center">
                  <ChevronLeftIcon className="h-5 w-5 text-[#006AFC]" />
                </button>
                <div className="flex items-center px-4 py-2 flex-1 justify-center relative min-w-0">
                  <button 
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="flex items-center hover:bg-gray-50 rounded p-1 transition-colors min-w-0"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none" className="mr-2 flex-shrink-0">
                      <path d="M14.25 3.31127H3.75C2.92157 3.31127 2.25 3.98284 2.25 4.81127V15.3113C2.25 16.1397 2.92157 16.8113 3.75 16.8113H14.25C15.0784 16.8113 15.75 16.1397 15.75 15.3113V4.81127C15.75 3.98284 15.0784 3.31127 14.25 3.31127Z" stroke="#2C3442" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 1.81127V4.81127" stroke="#2C3442" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M6 1.81127V4.81127" stroke="#2C3442" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2.25 7.81127H15.75" stroke="#2C3442" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-gray-700 truncate">{formatDate(currentDate)}</span>
                  </button>
                  
                  {/* Calendario desplegable */}
                  {showDatePicker && (
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10 w-80 date-picker-container">
                      <div className="p-4">
                        <h3 className="font-medium mb-2">Seleccionar Fecha</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Fecha
                            </label>
                            <input
                              type="date"
                              value={selectedDateForPicker}
                              onChange={(e) => setSelectedDateForPicker(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AFC]"
                            />
                          </div>
                          {selectedDateForPicker && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleDatePickerChange(selectedDateForPicker)}
                                className="flex-1 px-4 py-2 bg-[#006AFC] text-white rounded-lg hover:bg-blue-600 transition-colors"
                              >
                                Ir a fecha
                              </button>
                              <button
                                onClick={() => {
                                  setShowDatePicker(false)
                                  setSelectedDateForPicker('')
                                }}
                                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                              >
                                Cancelar
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <button onClick={() => addDays(1)} className="p-2 hover:bg-gray-50 border-l border-gray-200 w-12 flex justify-center">
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

          {/* Selector de personal cuando el servicio lo requiere */}
          {selectedService?.needsStaff && !selectedStaff && (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Selecciona el personal</h3>
              <p className="text-gray-600 mb-6">Este servicio requiere personal específico. Elige quién lo atenderá:</p>
              <div className="relative inline-block">
                <button 
                  onClick={() => setShowStaffDropdown(!showStaffDropdown)}
                  className="flex items-center px-4 py-2 bg-[#006AFC] text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <UserIcon className="h-5 w-5 mr-2" />
                  Seleccionar Personal
                  <ChevronDownIcon className={`h-4 w-4 ml-2 transition-transform duration-200 ${showStaffDropdown ? 'rotate-180' : ''}`} />
                </button>
                
                {showStaffDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    <div className="p-2">
                      {getAvailableStaffForService(selectedService.id).length === 0 ? (
                        <div className="p-3 text-center text-gray-500">
                          No hay personal disponible para este servicio
                        </div>
                      ) : (
                        getAvailableStaffForService(selectedService.id).map((member) => (
                          <button
                            key={member.id}
                            onClick={() => {
                              setSelectedStaff(member)
                              setShowStaffDropdown(false)
                            }}
                            className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                          >
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <UserIcon className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-800">{member.name}</div>
                              <div className="text-sm text-gray-500">{member.position}</div>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Calendario */}
          {selectedService && (!selectedService.needsStaff || selectedStaff) && (
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
                                      {reservation.staffId && (
                                        <div className="text-xs text-gray-600 mt-1">
                                          {staff.find(s => s.id === reservation.staffId)?.name}
                                        </div>
                                      )}
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
                {/* Mostrar información del servicio y personal seleccionado */}
                {selectedService && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-800">Servicio seleccionado</h3>
                        <p className="text-gray-600">{selectedService.name} ({selectedService.durationInterval})</p>
                        {selectedStaff && (
                          <p className="text-gray-600">Personal: {selectedStaff.name}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedService(null)
                          setSelectedStaff(null)
                          setFormData({ ...formData, serviceId: '' })
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Cambiar
                      </button>
                    </div>
                  </div>
                )}

                {/* Solo mostrar selector de servicio si no hay uno seleccionado */}
                {!selectedService && (
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
                )}

                {/* Solo mostrar selector de personal si no hay uno seleccionado y el servicio lo requiere */}
                {!selectedStaff && selectedService?.needsStaff && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Personal asignado
                    </label>
                    <div className="relative">
                      <button 
                        type="button"
                        onClick={() => setShowStaffDropdown(!showStaffDropdown)}
                        className="w-full flex items-center justify-between px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006AFC] focus:border-transparent"
                      >
                        <span className="text-gray-700">
                          {selectedStaffId ? 
                            staff.find(s => s.id === selectedStaffId)?.name || 'Seleccionar personal' 
                            : 'Seleccionar personal'
                          }
                        </span>
                        <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${showStaffDropdown ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showStaffDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg">
                          <div className="p-2">
                            {getAvailableStaffForService(selectedService.id).length === 0 ? (
                              <div className="p-3 text-center text-gray-500">
                                No hay personal disponible para este servicio
                              </div>
                            ) : (
                              getAvailableStaffForService(selectedService.id).map((member) => (
                                <button
                                  key={member.id}
                                  type="button"
                                  onClick={() => {
                                    setSelectedStaff(member)
                                    setSelectedStaffId(member.id)
                                    setShowStaffDropdown(false)
                                  }}
                                  className="w-full flex items-center p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                  <UserIcon className="h-4 w-4 text-gray-400 mr-3" />
                                  <div>
                                    <div className="font-medium text-gray-800">{member.name}</div>
                                    <div className="text-sm text-gray-500">{member.position}</div>
                                  </div>
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Solo mostrar selector de día y hora si no se seleccionó una celda específica */}
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

                {/* Mostrar información del turno seleccionado si se hizo click en una celda */}
                {selectedCell && selectedService && (
                  <div className="bg-blue-50 rounded-lg p-4 mb-4">
                    <h3 className="font-medium text-gray-800 mb-2">Turno seleccionado</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Día:</span>
                        <p className="font-medium">
                          {getWeekDates(currentDate)[selectedCell.day].toLocaleDateString('es-ES', { 
                            weekday: 'long', 
                            day: 'numeric', 
                            month: 'short' 
                          })}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-600">Hora:</span>
                        <p className="font-medium">{selectedCell.time}</p>
                      </div>
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