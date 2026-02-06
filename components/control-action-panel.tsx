"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertOctagon, ShieldAlert, CheckCircle, Radio, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

type AlertLevel = "normal" | "caution" | "lockdown"

interface ControlState {
  level: AlertLevel
  autonomousEnabled: boolean
  lastUpdate: Date
}

export function ControlActionPanel() {
  const [control, setControl] = useState<ControlState>({
    level: "caution",
    autonomousEnabled: true,
    lastUpdate: new Date(),
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setControl(prev => {
        const rand = Math.random()
        let newLevel: AlertLevel = "normal"
        if (rand > 0.7) newLevel = "lockdown"
        else if (rand > 0.4) newLevel = "caution"
        
        return {
          level: newLevel,
          autonomousEnabled: newLevel !== "lockdown",
          lastUpdate: new Date(),
        }
      })
    }, 8000)

    return () => clearInterval(interval)
  }, [])

  const alertConfig = {
    normal: {
      title: "All Systems Nominal",
      message: "Autonomous operation running within acceptable parameters. No intervention required.",
      icon: CheckCircle,
      bgColor: "bg-[hsl(var(--success))]/10",
      borderColor: "border-[hsl(var(--success))]/30",
      textColor: "text-[hsl(var(--success))]",
      iconColor: "text-[hsl(var(--success))]",
    },
    caution: {
      title: "Elevated Risk Detected",
      message: "Model drift approaching threshold. Automated safeguards engaged. Monitor closely.",
      icon: AlertTriangle,
      bgColor: "bg-[hsl(var(--warning))]/10",
      borderColor: "border-[hsl(var(--warning))]/30",
      textColor: "text-[hsl(var(--warning))]",
      iconColor: "text-[hsl(var(--warning))]",
    },
    lockdown: {
      title: "LOCKDOWN: Autonomous Operation Disabled",
      message: "Manual override required. System has detected unsafe drift levels in low-visibility conditions.",
      icon: AlertOctagon,
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive/30",
      textColor: "text-destructive",
      iconColor: "text-destructive",
    },
  }

  const currentAlert = alertConfig[control.level]
  const AlertIcon = currentAlert.icon

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
          <ShieldAlert className="h-5 w-5 text-primary" />
          Control Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Alert Box */}
        <div
          className={cn(
            "relative overflow-hidden rounded-lg border-2 p-6 transition-all duration-300",
            currentAlert.bgColor,
            currentAlert.borderColor,
            control.level === "lockdown" && "animate-pulse"
          )}
        >
          <div className="flex items-start gap-4">
            <div className={cn(
              "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full",
              control.level === "lockdown" ? "bg-destructive/20" :
              control.level === "caution" ? "bg-[hsl(var(--warning))]/20" :
              "bg-[hsl(var(--success))]/20"
            )}>
              <AlertIcon className={cn("h-6 w-6", currentAlert.iconColor)} />
            </div>
            <div className="flex-1">
              <h3 className={cn("text-xl font-bold", currentAlert.textColor)}>
                {control.level === "lockdown" && "⛔ "}
                {currentAlert.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {currentAlert.message}
              </p>
            </div>
          </div>
          
          {control.level === "lockdown" && (
            <div className="absolute -right-4 -top-4 h-24 w-24 animate-ping rounded-full bg-destructive/10" />
          )}
        </div>

        {/* Control Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-full bg-secondary px-4 py-2">
            <Radio className={cn(
              "h-4 w-4",
              control.autonomousEnabled ? "text-[hsl(var(--success))]" : "text-destructive"
            )} />
            <span className="text-sm text-foreground">
              Autonomous: {control.autonomousEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>
          
          {control.level === "lockdown" && (
            <Button 
              variant="destructive" 
              className="gap-2"
              onClick={() => setControl(prev => ({ ...prev, level: "caution", autonomousEnabled: true }))}
            >
              <ShieldAlert className="h-4 w-4" />
              Request Manual Override
            </Button>
          )}

          <div className="ml-auto text-xs text-muted-foreground">
            Last updated: {control.lastUpdate.toLocaleTimeString()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
