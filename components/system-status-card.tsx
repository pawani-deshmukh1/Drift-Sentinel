"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Brain } from "lucide-react"

export function SystemStatusCard({
  riskLevel,
  actionRequired,
  modelConfidence,
}: {
  riskLevel: string
  actionRequired: string
  modelConfidence: string
}) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          System Status
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-3 gap-4">
        <div className="rounded-lg bg-secondary p-4">
          <p className="text-sm text-muted-foreground">Risk Level</p>
          <p className="text-2xl font-bold">{riskLevel}</p>
        </div>

        <div className="rounded-lg bg-secondary p-4">
          <p className="text-sm text-muted-foreground">Action</p>
          <p className="font-medium">{actionRequired}</p>
        </div>

        <div className="rounded-lg bg-secondary p-4">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Model Confidence
            </span>
          </div>
          <p className="text-lg font-semibold">{modelConfidence}</p>
        </div>
      </CardContent>
    </Card>
  )
}
