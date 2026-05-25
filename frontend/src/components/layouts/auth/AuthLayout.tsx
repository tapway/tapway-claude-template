'use client'

import { type ReactNode } from 'react'
import Image from 'next/image'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-[#0F1E3D] p-12">
        <div>
          <Image
            src="/tapway-logo.png"
            alt="Tapway"
            width={140}
            height={32}
            className="h-8 w-auto brightness-0 invert"
          />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-semibold leading-tight text-white">
            Turning Vision
            <br />
            Into Actions
          </h1>
          <p className="text-lg text-gray-400">
            AI Vision Platform for Southeast Asia
          </p>
        </div>
        <p className="text-sm text-gray-500">an ITMAX subsidiary</p>
      </div>
      <div className="flex items-center justify-center bg-background p-8">
        <div className="w-full max-w-md space-y-8">{children}</div>
      </div>
    </div>
  )
}