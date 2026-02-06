"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Fuel } from "lucide-react"
import { cn } from "@/lib/utils"

interface RiskBudgetGaugeProps {
  externalBudget?: number
  onBudgetChange?: (budget: number) => void
}

export function RiskBudgetGauge({ externalBudget, onBudgetChange }: RiskBudgetGaugeProps) {
  const budget = externalBudget ?? 68

  const getGradient = (value: number) => {
    if (value > 60) return "from-[hsl(var(--success))] to-[hsl(142,71%,55%)]"
    if (value > 30) return "from-[hsl(var(--warning))] to-[hsl(38,92%,60%)]"
    return "from-destructive to-[hsl(0,72%,60%)]"
  }

  const getTextColor = (value: number) => {
    if (value > 60) return "text-[hsl(var(--success))]"
    if (value > 30) return "text-[hsl(var(--warning))]"
    return "text-destructive"
  }

  const getStatusText = (value: number) => {
    if (value > 60) return "Adequate"
    if (value > 30) return "Depleting"
    return "Critical"
  }

  return (
    <Card className="h-full border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
          <Fuel className="h-5 w-5 text-primary" />
          Operational Risk Budget
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center pt-4">
        {/* Circular Gauge */}
        <div className="relative h-40 w-40">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            {/* Background track */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              stroke="hsl(var(--secondary))"
              strokeWidth="12"
              strokeLinecap="round"
            />
            {/* Foreground progress */}
            <circle
              cx="50"
              cy="50"
              r="42"
              fill="none"
              className={cn(
                budget > 60 ? "stroke-[hsl(var(--success))]" :
                budget > 30 ? "stroke-[hsl(var(--warning))]" :
                "stroke-destructive"
              )}
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${(budget / 100) * 264} 264`}
              style={{ transition: "stroke-dasharray 0.5s ease" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("text-4xl font-bold tabular-nums", getTextColor(budget))}>
              {Math.round(budget)}%
            </span>
            <span className="text-sm text-muted-foreground">Remaining</span>
          </div>
        </div>

        {/* Status Bar */}
        <div className="mt-6 w-full space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <span className={cn("font-medium", getTextColor(budget))}>
              {getStatusText(budget)}
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className={cn(
                "h-full bg-gradient-to-r transition-all duration-500",
                getGradient(budget)
              )}
              style={{ width: `${budget}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Empty</span>
            <span>Full</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
