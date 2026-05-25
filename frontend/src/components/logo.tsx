'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn('flex items-center gap-2', className)}>
      <Image
        src="/tapway-logo.png"
        alt="Tapway"
        width={120}
        height={28}
        className="h-7 w-auto"
        priority
      />
    </Link>
  )
}