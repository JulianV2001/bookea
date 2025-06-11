'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

type DaySchedule = {
  isOpen: boolean
  openTime: string
  closeTime: string
  intervals: string[]
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
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined)

export function ScheduleProvider({ children }: { children: ReactNode }) {
  const [scheduleConfig, setScheduleConfig] = useState<ScheduleConfig>({})
  const [specialDates, setSpecialDates] = useState<SpecialDate[]>([])
  const [maxBookingDays, setMaxBookingDays] = useState<number>(30)

  const updateScheduleConfig = (config: ScheduleConfig) => {
    setScheduleConfig(config)
  }

  const updateMaxBookingDays = (days: number) => {
    setMaxBookingDays(days)
  }

  const addSpecialDate = (date: string, type: 'closed' | 'special') => {
    if (!date) return
    // Ajustar la fecha para evitar problemas de zona horaria
    const [year, month, day] = date.split('-').map(Number)
    const adjustedDate = new Date(year, month - 1, day)
    const formattedDate = adjustedDate.toISOString().split('T')[0]
    
    setSpecialDates(prev => [...prev, { date: formattedDate, type }])
  }

  const removeSpecialDate = (dateToRemove: string) => {
    // Asegurarnos de que la fecha a eliminar esté en el mismo formato
    const [year, month, day] = dateToRemove.split('-').map(Number)
    const formattedDateToRemove = new Date(year, month - 1, day).toISOString().split('T')[0]
    
    setSpecialDates(prev => prev.filter(({ date }) => {
      const [y, m, d] = date.split('-').map(Number)
      const formattedDate = new Date(y, m - 1, d).toISOString().split('T')[0]
      return formattedDate !== formattedDateToRemove
    }))
  }

  return (
    <ScheduleContext.Provider value={{ 
      scheduleConfig, 
      updateScheduleConfig,
      specialDates,
      addSpecialDate,
      removeSpecialDate,
      maxBookingDays,
      updateMaxBookingDays
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