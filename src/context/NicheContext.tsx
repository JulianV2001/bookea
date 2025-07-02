'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type NicheType = 'sport' | 'beauty' | 'consultation'

interface NicheContextType {
  selectedNiche: NicheType | null
  setSelectedNiche: (niche: NicheType) => void
  clearNiche: () => void
  isNicheSelected: boolean
}

const NicheContext = createContext<NicheContextType | undefined>(undefined)

export function NicheProvider({ children }: { children: ReactNode }) {
  const [selectedNiche, setSelectedNicheState] = useState<NicheType | null>(null)

  // Cargar el nicho desde localStorage al inicializar
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedNiche = localStorage.getItem('selectedNiche') as NicheType
      if (savedNiche && ['sport', 'beauty', 'consultation'].includes(savedNiche)) {
        setSelectedNicheState(savedNiche)
      }
    }
  }, [])

  const setSelectedNiche = (niche: NicheType) => {
    setSelectedNicheState(niche)
    localStorage.setItem('selectedNiche', niche)
  }

  const clearNiche = () => {
    setSelectedNicheState(null)
    localStorage.removeItem('selectedNiche')
  }

  const isNicheSelected = selectedNiche !== null

  return (
    <NicheContext.Provider value={{
      selectedNiche,
      setSelectedNiche,
      clearNiche,
      isNicheSelected
    }}>
      {children}
    </NicheContext.Provider>
  )
}

export function useNiche() {
  const context = useContext(NicheContext)
  if (context === undefined) {
    throw new Error('useNiche must be used within a NicheProvider')
  }
  return context
} 