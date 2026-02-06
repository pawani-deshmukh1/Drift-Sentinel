"use client"

import { useEffect, useState } from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"

const API_BASE = "http://127.0.0.1:8000"

interface DriftPoint {
  step: number
  score: number
}

export function DriftTrendChart() {
  const [data, setData] = useState<DriftPoint[]>([])

  useEffect(() => {
    const fetchDrift = async () => {
      try {
        const res = await fetch(`${API_BASE}/drift-report`)
        const json = await res.json()

        // Convert feature-level drift into a single trend score
        const driftScore =
          json.feature_details.filter((f: any) => f.drift_detected).length * 15

        setData((prev) => {
          const nextStep = prev.length + 1
          const newPoint = { step: nextStep, score: driftScore }

          return [...prev.slice(-14), newPoint] // keep last 15 points
        })
      } catch (err) {
        console.error("Drift fetch failed", err)
      }
    }

    fetchDrift()
    const interval = setInterval(fetchDrift, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Drift Trend (Live)
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Aggregated drift severity over time
        </p>
      </CardHeader>

      <CardContent>
        <div className="h-[260px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="step" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#ef4444"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
