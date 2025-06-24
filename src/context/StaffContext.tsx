'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

export interface Staff {
  id: string
  name: string
  position: string
  phone: string
  email: string
  schedule: string
  isActive: boolean
  services: string[] // IDs de los servicios que puede atender
}

export interface StaffReservation {
  id: string
  clientName: string
  serviceId: string
  serviceName: string
  duration: string
  clientEmail: string
  clientPhone: string
  time: string
  date: Date
  staffId: string
}

type StaffContextType = {
  staff: Staff[]
  staffReservations: StaffReservation[]
  addStaff: (staff: Staff) => void
  updateStaff: (staff: Staff) => void
  deleteStaff: (staffId: string) => void
  getStaffById: (staffId: string) => Staff | undefined
  addStaffReservation: (reservation: StaffReservation) => void
  getStaffReservations: (staffId: string, date: string) => StaffReservation[]
  isLoading: boolean
}

const StaffContext = createContext<StaffContextType | undefined>(undefined)

export function StaffProvider({ children }: { children: ReactNode }) {
  const [staff, setStaff] = useState<Staff[]>([])
  const [staffReservations, setStaffReservations] = useState<StaffReservation[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Cargar personal del localStorage al inicializar
  useEffect(() => {
    try {
      const savedStaff = localStorage.getItem('staff')
      const savedReservations = localStorage.getItem('staffReservations')
      
      if (savedStaff) {
        setStaff(JSON.parse(savedStaff))
      } else {
        // Datos de ejemplo si no hay personal guardado
        const exampleStaff: Staff[] = [
          {
            id: '1',
            name: 'Juan Pérez',
            position: 'Barbero',
            phone: '+54 11 1234-5678',
            email: 'juan.perez@barberia.com',
            schedule: 'Lunes a Viernes, 09:00 - 18:00',
            isActive: true,
            services: ['1', '2'] // IDs de servicios que puede atender
          },
          {
            id: '2',
            name: 'María González',
            position: 'Estilista',
            phone: '+54 11 9876-5432',
            email: 'maria.gonzalez@barberia.com',
            schedule: 'Martes a Sábado, 10:00 - 19:00',
            isActive: true,
            services: ['1', '3'] // IDs de servicios que puede atender
          }
        ]
        setStaff(exampleStaff)
        localStorage.setItem('staff', JSON.stringify(exampleStaff))
      }
      
      if (savedReservations) {
        setStaffReservations(JSON.parse(savedReservations))
      }
    } catch (error) {
      console.error('Error loading staff from localStorage:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const addStaff = (newStaff: Staff) => {
    setStaff(prev => {
      const newStaffList = [...prev, newStaff]
      try {
        localStorage.setItem('staff', JSON.stringify(newStaffList))
      } catch (error) {
        console.error('Error saving staff to localStorage:', error)
      }
      return newStaffList
    })
  }

  const updateStaff = (updatedStaff: Staff) => {
    setStaff(prev => {
      const newStaffList = prev.map(s => s.id === updatedStaff.id ? updatedStaff : s)
      try {
        localStorage.setItem('staff', JSON.stringify(newStaffList))
      } catch (error) {
        console.error('Error saving staff to localStorage:', error)
      }
      return newStaffList
    })
  }

  const deleteStaff = (staffId: string) => {
    setStaff(prev => {
      const newStaffList = prev.filter(s => s.id !== staffId)
      try {
        localStorage.setItem('staff', JSON.stringify(newStaffList))
      } catch (error) {
        console.error('Error saving staff to localStorage:', error)
      }
      return newStaffList
    })
  }

  const getStaffById = (staffId: string) => {
    return staff.find(s => s.id === staffId)
  }

  const addStaffReservation = (reservation: StaffReservation) => {
    setStaffReservations(prev => {
      const newReservations = [...prev, reservation]
      try {
        localStorage.setItem('staffReservations', JSON.stringify(newReservations))
      } catch (error) {
        console.error('Error saving staff reservations to localStorage:', error)
      }
      return newReservations
    })
  }

  const getStaffReservations = (staffId: string, date: string) => {
    return staffReservations.filter(reservation => {
      const reservationDate = new Date(reservation.date)
      const targetDate = new Date(date)
      return reservation.staffId === staffId &&
             reservationDate.getDate() === targetDate.getDate() &&
             reservationDate.getMonth() === targetDate.getMonth() &&
             reservationDate.getFullYear() === targetDate.getFullYear()
    })
  }

  return (
    <StaffContext.Provider value={{
      staff,
      staffReservations,
      addStaff,
      updateStaff,
      deleteStaff,
      getStaffById,
      addStaffReservation,
      getStaffReservations,
      isLoading
    }}>
      {children}
    </StaffContext.Provider>
  )
}

export function useStaff() {
  const context = useContext(StaffContext)
  if (context === undefined) {
    throw new Error('useStaff must be used within a StaffProvider')
  }
  return context
} 