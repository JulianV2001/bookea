'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { useSchedule } from './ScheduleContext'

export interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number // en minutos
  durationInterval: string // intervalo de tiempo seleccionado
  category: string
  type: 'service' | 'sport' | 'consultation'
  isActive: boolean
  needsStaff: boolean // Nueva propiedad para indicar si el servicio necesita personal
}

export interface TimeSlot {
  id: string
  startTime: string
  endTime: string
  isAvailable: boolean
  isBooked: boolean
}

export interface DaySchedule {
  date: string
  timeSlots: TimeSlot[]
}

type ServicesContextType = {
  services: Service[]
  addService: (service: Service) => void
  updateService: (service: Service) => void
  deleteService: (serviceId: string) => void
  getServiceById: (serviceId: string) => Service | undefined
  generateTimeSlots: (serviceId: string, date: string) => TimeSlot[]
  isLoading: boolean
}

const ServicesContext = createContext<ServicesContextType | undefined>(undefined)

export function ServicesProvider({ children }: { children: ReactNode }) {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { scheduleConfig } = useSchedule()

  // Cargar servicios del localStorage al inicializar
  useEffect(() => {
    // Verificar que estamos en el cliente
    if (typeof window === 'undefined') {
      setIsLoading(false)
      return
    }

    try {
      const savedServices = localStorage.getItem('services')
      if (savedServices) {
        setServices(JSON.parse(savedServices))
      } else {
        // Datos de ejemplo si no hay servicios guardados
        const exampleServices: Service[] = [
          {
            id: '1',
            name: 'Corte de Cabello',
            type: 'service',
            category: 'Peluquería',
            duration: 30,
            durationInterval: '30 min',
            price: 2500,
            description: 'Corte de cabello profesional',
            isActive: true,
            needsStaff: true // Requiere personal específico
          },
          {
            id: '2',
            name: 'Barba',
            type: 'service',
            category: 'Peluquería',
            duration: 20,
            durationInterval: '20 min',
            price: 1500,
            description: 'Arreglo de barba',
            isActive: true,
            needsStaff: true // Requiere personal específico
          },
          {
            id: '3',
            name: 'Corte + Barba',
            type: 'service',
            category: 'Peluquería',
            duration: 45,
            durationInterval: '45 min',
            price: 3500,
            description: 'Corte de cabello y arreglo de barba',
            isActive: true,
            needsStaff: true // Requiere personal específico
          },
          {
            id: '4',
            name: 'Cancha de Fútbol',
            type: 'sport',
            category: 'Deportes',
            duration: 60,
            durationInterval: '1 hora',
            price: 5000,
            description: 'Alquiler de cancha de fútbol',
            isActive: true,
            needsStaff: false // No requiere personal específico
          },
          {
            id: '5',
            name: 'Cancha de Pádel',
            type: 'sport',
            category: 'Deportes',
            duration: 60,
            durationInterval: '1 hora',
            price: 3000,
            description: 'Alquiler de cancha de pádel',
            isActive: true,
            needsStaff: false // No requiere personal específico
          },
          {
            id: '6',
            name: 'Consulta Médica',
            type: 'consultation',
            category: 'Salud',
            duration: 30,
            durationInterval: '30 min',
            price: 8000,
            description: 'Consulta médica general',
            isActive: true,
            needsStaff: true // Requiere personal específico
          }
        ]
        setServices(exampleServices)
        localStorage.setItem('services', JSON.stringify(exampleServices))
      }
    } catch (error) {
      console.error('Error loading services from localStorage:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addService = (service: Service) => {
    setServices(prev => {
      const newServices = [...prev, service]
      // Guardar en localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('services', JSON.stringify(newServices))
        } catch (error) {
          console.error('Error saving services to localStorage:', error)
        }
      }
      return newServices
    })
  }

  const updateService = (updatedService: Service) => {
    setServices(prev => {
      const newServices = prev.map(service => 
        service.id === updatedService.id ? updatedService : service
      )
      // Guardar en localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('services', JSON.stringify(newServices))
        } catch (error) {
          console.error('Error saving services to localStorage:', error)
        }
      }
      return newServices
    })
  }

  const deleteService = (serviceId: string) => {
    setServices(prev => {
      const newServices = prev.filter(service => service.id !== serviceId)
      // Guardar en localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('services', JSON.stringify(newServices))
        } catch (error) {
          console.error('Error saving services to localStorage:', error)
        }
      }
      return newServices
    })
  }

  const getServiceById = (serviceId: string) => {
    return services.find(service => service.id === serviceId)
  }

  // Función para generar turnos basados en el horario configurado y la duración del servicio
  const generateTimeSlots = (serviceId: string, date: string): TimeSlot[] => {
    const service = getServiceById(serviceId)
    if (!service) {
      return []
    }

    // Obtener el día de la semana (0 = domingo, 1 = lunes, etc.)
    // Evitar problemas de zona horaria parseando la fecha manualmente
    const [year, month, day] = date.split('-').map(Number)
    const dayOfWeek = new Date(year, month - 1, day).getDay() // month - 1 porque getMonth() es 0-based
    const dayId = dayOfWeek === 0 ? 7 : dayOfWeek // Convertir domingo de 0 a 7

    // Usar el horario configurado real
    const daySchedule = scheduleConfig[dayId]
    
    if (!daySchedule?.isOpen) {
      return []
    }

    const timeSlots: TimeSlot[] = []
    let slotId = 1

    // Procesar cada bloque de tiempo del día
    daySchedule.timeBlocks.forEach((block, blockIndex) => {
      let currentTime = new Date(`2000-01-01T${block.openTime}:00`)
      const closeTime = new Date(`2000-01-01T${block.closeTime}:00`)

      while (currentTime < closeTime) {
        const startTime = currentTime.toTimeString().slice(0, 5)
        
        // Calcular el tiempo de fin sumando la duración del servicio
        const endTime = new Date(currentTime.getTime() + service.duration * 60000)
        const endTimeString = endTime.toTimeString().slice(0, 5)

        // Verificar que el turno no exceda el horario de cierre
        if (endTime <= closeTime) {
          timeSlots.push({
            id: `${slotId}`,
            startTime,
            endTime: endTimeString,
            isAvailable: true,
            isBooked: false
          })
          
          slotId++
        }

        // Mover al siguiente turno
        currentTime = endTime
      }
    })

    return timeSlots
  }

  return (
    <ServicesContext.Provider value={{
      services,
      addService,
      updateService,
      deleteService,
      getServiceById,
      generateTimeSlots,
      isLoading
    }}>
      {children}
    </ServicesContext.Provider>
  )
}

export function useServices() {
  const context = useContext(ServicesContext)
  if (context === undefined) {
    throw new Error('useServices must be used within a ServicesProvider')
  }
  return context
} 