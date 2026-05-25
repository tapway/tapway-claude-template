'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { MenuItem } from './sidebar-data'
import { useSidebarContext } from './sidebar-context'

export function SidebarMenuItem({
  item,
  isActive,
  isExpanded,
  onToggle,
}: {
  item: MenuItem
  isActive: boolean
  isExpanded?: boolean
  onToggle?: () => void
}) {
  const pathname = usePathname()
  const { isMobile, setIsOpen } = useSidebarContext()
  const hasSubItems = item.items && item.items.length > 0

  const handleClick = () => {
    if (hasSubItems) {
      onToggle?.()
    } else if (isMobile) {
      setIsOpen(false)
    }
  }

  const commonClasses = cn(
    'group relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive
      ? 'bg-primary text-primary-foreground'
      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
  )

  if (hasSubItems) {
    return (
      <li>
        <button onClick={handleClick} className={commonClasses}>
          <item.icon className="h-5 w-5 shrink-0" />
          <span className="flex-1 text-left">{item.title}</span>
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 transition-transform duration-200',
              isExpanded && 'rotate-180'
            )}
          />
        </button>
        {isExpanded && item.items && (
          <ul className="ml-8 mt-1 space-y-1">
            {item.items.map((sub) => {
              const subActive = pathname === sub.url
              return (
                <li key={sub.url}>
                  <Link
                    href={sub.url}
                    onClick={() => isMobile && setIsOpen(false)}
                    className={cn(
                      'block rounded-md px-3 py-2 text-sm transition-colors',
                      subActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    {sub.title}
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </li>
    )
  }

  return (
    <li>
      <Link href={item.url ?? '/'} onClick={handleClick} className={commonClasses}>
        <item.icon className="h-5 w-5 shrink-0" />
        <span>{item.title}</span>
      </Link>
    </li>
  )
}