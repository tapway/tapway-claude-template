'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const alertData = Array.from({ length: 30 }, () => 20 + Math.floor(Math.random() * 80))

export default function ChartsPage() {
  const alerts = useMemo(() => alertData, [])
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Charts</h1>
        <p className="text-sm text-muted-foreground">Data visualisation and analytics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-[250px] items-end gap-2">
              {[40, 55, 35, 70, 50, 80, 60, 90, 65, 85, 75, 95].map((height, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-primary/60 transition-colors hover:bg-primary"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span>
              <span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
              <span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Active Cameras</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-[250px] items-end gap-3">
              {[65, 80, 45, 90, 55, 70, 85].map((height, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-sm bg-[#4472C4]/60 transition-colors hover:bg-[#4472C4]"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Department Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-center justify-center gap-6">
              <div className="flex h-36 w-36 items-center justify-center rounded-full border-8 border-primary/20 border-b-primary border-l-[#4472C4] border-r-[#F5A623] border-t-primary">
                <div className="text-center">
                  <div className="text-lg font-bold text-foreground">3</div>
                  <div className="text-xs text-muted-foreground">Departments</div>
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'Engineering', value: 45, color: 'bg-primary' },
                  { label: 'Operations', value: 30, color: 'bg-[#4472C4]' },
                  { label: 'Support', value: 25, color: 'bg-[#F5A623]' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${item.color}`} />
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <span className="ml-auto text-sm font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Alert Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-end gap-1">
              {alerts.map((height, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm bg-destructive/40 transition-colors hover:bg-destructive/60"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-muted-foreground">
              <span>Day 1</span>
              <span>Day 30</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}