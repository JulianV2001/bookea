'use client'

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

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

type SpecialDate = {
  date: string
  type: 'closed' | 'special'
}

type ScheduleConfig = {
  [key: number]: DaySchedule
}

type ScheduleContextType = {
  scheduleConfig: ScheduleConfig
  updateScheduleConfig: (config: ScheduleConfig) => void
  specialDates: SpecialDate[]
  addSpecialDate: (date: string, type: 'closed' | 'special') => void
  removeSpecialDate: (date: string) => void
  maxBookingDays: number
  updateMaxBookingDays: (days: number) => void
  isLoading: boolean
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined)

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [scheduleConfig, setScheduleConfig] = useState<ScheduleConfig>({})
  const [specialDates, setSpecialDates] = useState<SpecialDate[]>([])
  const [maxBookingDays, setMaxBookingDays] = useState<number>(30)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Cargar datos del localStorage al inicializar
  useEffect(() => {
    // Verificar que estamos en el cliente
    if (typeof window === 'undefined') {
      setIsLoading(false)
      return
    }

    try {
      const savedScheduleConfig = localStorage.getItem('scheduleConfig')
      if (savedScheduleConfig) {
        setScheduleConfig(JSON.parse(savedScheduleConfig))
      }
      
      const savedSpecialDates = localStorage.getItem('specialDates')
      if (savedSpecialDates) {
        setSpecialDates(JSON.parse(savedSpecialDates))
      }
      
      const savedMaxBookingDays = localStorage.getItem('maxBookingDays')
      if (savedMaxBookingDays) {
        setMaxBookingDays(Number(savedMaxBookingDays))
      }
    } catch (error) {
      console.error('Error loading schedule data from localStorage:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateScheduleConfig = (config: ScheduleConfig) => {
    setScheduleConfig(config)
    // Guardar en localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('scheduleConfig', JSON.stringify(config))
      } catch (error) {
        console.error('Error saving schedule config to localStorage:', error)
      }
    }
  }

  const updateMaxBookingDays = (days: number) => {
    setMaxBookingDays(days)
    // Guardar en localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('maxBookingDays', days.toString())
      } catch (error) {
        console.error('Error saving maxBookingDays to localStorage:', error)
      }
    }
  }

  const addSpecialDate = (date: string, type: 'closed' | 'special') => {
    if (!date) return
    // Ajustar la fecha para evitar problemas de zona horaria
    const [year, month, day] = date.split('-').map(Number)
    const adjustedDate = new Date(year, month - 1, day)
    const formattedDate = adjustedDate.toISOString().split('T')[0]
    
    setSpecialDates(prev => {
      const newSpecialDates = [...prev, { date: formattedDate, type }]
      // Guardar en localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('specialDates', JSON.stringify(newSpecialDates))
        } catch (error) {
          console.error('Error saving special dates to localStorage:', error)
        }
      }
      return newSpecialDates
    })
  }

  const removeSpecialDate = (dateToRemove: string) => {
    // Asegurarnos de que la fecha a eliminar esté en el mismo formato
    const [year, month, day] = dateToRemove.split('-').map(Number)
    const formattedDateToRemove = new Date(year, month - 1, day).toISOString().split('T')[0]
    
    setSpecialDates(prev => {
      const newSpecialDates = prev.filter(({ date }) => {
        const [y, m, d] = date.split('-').map(Number)
        const formattedDate = new Date(y, m - 1, d).toISOString().split('T')[0]
        return formattedDate !== formattedDateToRemove
      })
      // Guardar en localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('specialDates', JSON.stringify(newSpecialDates))
        } catch (error) {
          console.error('Error saving special dates to localStorage:', error)
        }
      }
      return newSpecialDates
    })
  }

  return (
    <ScheduleContext.Provider value={{ 
      scheduleConfig, 
      updateScheduleConfig,
      specialDates,
      addSpecialDate,
      removeSpecialDate,
      maxBookingDays,
      updateMaxBookingDays,
      isLoading
    }}>
      {children}
    </ScheduleContext.Provider>
  )
}

export function useSchedule() {
  const context = useContext(ScheduleContext)
  if (context === undefined) {
    throw new Error('useSchedule must be used within a ScheduleProvider')
  }
  return context
} 