"use client"

import { Activity, Shield } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="border-b border-border bg-card">
      <div className="container mx-auto flex items-center justify-between px-4 py-4 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Drift Sentinel</h1>
            <p className="text-sm text-muted-foreground">AI Drift, Risk & Reliability Control</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Activity className="h-4 w-4 text-[hsl(var(--success))]" />
            <span>Live Monitoring</span>
          </div>
          <div className="hidden items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-foreground sm:flex">
            <span className="h-2 w-2 animate-pulse rounded-full bg-[hsl(var(--success))]" />
            System Online
          </div>
        </div>
      </div>
    </header>
  )
}
