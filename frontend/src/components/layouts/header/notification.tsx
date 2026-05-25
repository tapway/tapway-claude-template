'use client'

import { Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

export function Notification({ className }: { className?: string }) {
  return (
    <button
      className={cn(
        'relative rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors',
        className
      )}
      aria-label="Notifications"
    >
      <Bell className="h-5 w-5" />
      <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
        3
      </span>
    </button>
  )
}