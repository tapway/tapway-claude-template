'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

type SidebarContextType = {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  isMobile: boolean
  toggle: () => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    if (isMobile) setIsOpen(false)
    else setIsOpen(true)
  }, [isMobile])

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen, isMobile, toggle: () => setIsOpen((o) => !o) }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebarContext() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebarContext must be used within SidebarProvider')
  return ctx
}