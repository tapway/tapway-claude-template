'use client'

import { Menu } from 'lucide-react'
import { useSidebarContext } from '@/components/layouts/sidebar/sidebar-context'
import { ThemeToggle } from './theme-toggle'
import { Notification } from './notification'
import { UserInfo } from './user-info'

export function Header() {
  const { toggle, isMobile } = useSidebarContext()

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card px-6">
      <div className="flex items-center gap-4">
        {isMobile && (
          <button
            onClick={toggle}
            className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-1">
        <Notification />
        <ThemeToggle />
        <UserInfo />
      </div>
    </header>
  )
}