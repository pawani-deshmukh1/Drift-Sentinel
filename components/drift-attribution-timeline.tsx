"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { GitBranch } from "lucide-react"

interface DataPoint {
  step: number
  Helmet_Confidence: number
  Visibility_Level: number
  Fog_Density: number
  Motion_Blur: number
  Edge_Clarity: number
}

const FEATURES = [
  { key: "Helmet_Confidence", color: "hsl(200, 100%, 50%)", label: "Helmet Confidence" },
  { key: "Visibility_Level", color: "hsl(142, 71%, 45%)", label: "Visibility Level" },
  { key: "Fog_Density", color: "hsl(38, 92%, 50%)", label: "Fog Density" },
  { key: "Motion_Blur", color: "hsl(0, 72%, 51%)", label: "Motion Blur" },
  { key: "Edge_Clarity", color: "hsl(280, 65%, 60%)", label: "Edge Clarity" },
]

function generateDataPoint(step: number, prevPoint?: DataPoint): DataPoint {
  const variation = (base: number) => Math.max(0, Math.min(100, base + (Math.random() - 0.5) * 15))

  if (!prevPoint) {
    return {
      step,
      Helmet_Confidence: 25 + Math.random() * 20,
      Visibility_Level: 40 + Math.random() * 15,
      Fog_Density: 55 + Math.random() * 20,
      Motion_Blur: 20 + Math.random() * 15,
      Edge_Clarity: 30 + Math.random() * 20,
    }
  }

  return {
    step,
    Helmet_Confidence: variation(prevPoint.Helmet_Confidence),
    Visibility_Level: variation(prevPoint.Visibility_Level),
    Fog_Density: variation(prevPoint.Fog_Density),
    Motion_Blur: variation(prevPoint.Motion_Blur),
    Edge_Clarity: variation(prevPoint.Edge_Clarity),
  }
}

export function DriftAttributionTimeline() {
  const [data, setData] = useState<DataPoint[]>(() => {
    const initial: DataPoint[] = []
    let prev: DataPoint | undefined
    for (let i = 1; i <= 20; i++) {
      const point = generateDataPoint(i, prev)
      initial.push(point)
      prev = point
    }
    return initial
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => {
        const newData = prev.slice(1).map((p, i) => ({ ...p, step: i + 1 }))
        const lastPoint = prev[prev.length - 1]
        const newPoint = generateDataPoint(20, lastPoint)
        newData.push(newPoint)
        return newData
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="h-full border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg font-medium text-foreground">
          <GitBranch className="h-5 w-5 text-primary" />
          Drift Attribution Timeline
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Feature impact scores over time steps
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="step"
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                tickLine={{ stroke: "hsl(var(--border))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                label={{
                  value: "Time Step",
                  position: "insideBottom",
                  offset: -5,
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 11,
                }}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                tickLine={{ stroke: "hsl(var(--border))" }}
                axisLine={{ stroke: "hsl(var(--border))" }}
                label={{
                  value: "Impact Score",
                  angle: -90,
                  position: "insideLeft",
                  offset: 30,
                  fill: "hsl(var(--muted-foreground))",
                  fontSize: 11,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "8px",
                  color: "hsl(var(--foreground))",
                }}
                labelStyle={{ color: "hsl(var(--muted-foreground))" }}
                labelFormatter={(value) => `Time Step: ${value}`}
                formatter={(value: number, name: string) => {
                  const feature = FEATURES.find(f => f.key === name)
                  return [value.toFixed(1), feature?.label || name]
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="line"
                formatter={(value) => {
                  const feature = FEATURES.find(f => f.key === value)
                  return <span className="text-xs text-muted-foreground">{feature?.label || value}</span>
                }}
              />
              {FEATURES.map((feature) => (
                <Line
                  key={feature.key}
                  type="monotone"
                  dataKey={feature.key}
                  stroke={feature.color}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, fill: feature.color }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
