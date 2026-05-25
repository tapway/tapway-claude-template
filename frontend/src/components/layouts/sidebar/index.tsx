'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/logo'
import { sidebarData } from './sidebar-data'
import { SidebarMenuItem } from './menu-item'
import { useSidebarContext } from './sidebar-context'

export function Sidebar() {
  const pathname = usePathname()
  const { isOpen, isMobile, setIsOpen } = useSidebarContext()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  useEffect(() => {
    for (const section of sidebarData) {
      for (const item of section.items) {
        if (item.items) {
          const match = item.items.some((sub) => pathname === sub.url)
          if (match && !expandedItems.includes(item.title)) {
            setExpandedItems((prev) => [...prev, item.title])
          }
        }
      }
    }
  }, [pathname, expandedItems])

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    )
  }

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed bottom-0 left-0 top-0 z-50 flex flex-col border-r border-border bg-card transition-all duration-200 ease-linear lg:sticky lg:z-0',
          isOpen ? 'w-[290px]' : 'w-0 overflow-hidden',
          isMobile && 'h-screen'
        )}
        aria-label="Main navigation"
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
          </Link>
          {isMobile && (
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        <nav className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
          {sidebarData.map((section) => (
            <div key={section.label} className="mb-6">
              <h2 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {section.label}
              </h2>
              <ul className="space-y-1">
                {section.items.map((item) => (
                  <SidebarMenuItem
                    key={item.title}
                    item={item}
                    isActive={
                      pathname === item.url ||
                      (item.items?.some((sub) => pathname === sub.url) ?? false)
                    }
                    isExpanded={expandedItems.includes(item.title)}
                    onToggle={() => toggleExpanded(item.title)}
                  />
                ))}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-border px-4 py-3">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Tapway
          </p>
        </div>
      </aside>
    </>
  )
}