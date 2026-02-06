"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye } from "lucide-react"

const API_BASE = "http://127.0.0.1:8000"

export function ExplainabilityPanel() {
  const [feature, setFeature] = useState("—")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const fetchExplain = async () => {
      const res = await fetch(`${API_BASE}/explainability`)
      const data = await res.json()
      setFeature(data.top_driving_feature)
      setMessage(data.operator_message)
    }

    fetchExplain()
    const interval = setInterval(fetchExplain, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="text-primary" /> Drift Explainability
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Primary Drift Cause</p>
        <p className="text-lg font-semibold text-[hsl(var(--warning))]">
          {feature}
        </p>
        <p className="text-sm mt-2">{message}</p>
      </CardContent>
    </Card>
  )
}
