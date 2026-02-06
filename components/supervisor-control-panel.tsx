"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Upload, RefreshCw } from "lucide-react"

const API_BASE = "http://127.0.0.1:8000"

export function SupervisorControlPanel({
  onRecalibrate,
}: {
  onRecalibrate: () => void
}) {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  const handleUpload = async (file: File) => {
    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch(`${API_BASE}/analyze-video`, {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      setResult(data)
    } catch (err) {
      console.error("Upload failed", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Supervisor Override Console
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Restricted access. All actions are logged to the Black Box.
        </p>

        {/* Upload Video */}
        <label className="block">
          <input
            type="file"
            accept="video/*"
            hidden
            onChange={(e) => {
              if (e.target.files?.[0]) {
                handleUpload(e.target.files[0])
              }
            }}
          />
          <Button className="w-full" variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Upload PPE Video
          </Button>
        </label>

        {/* Recalibrate */}
        <Button
          className="w-full"
          onClick={onRecalibrate}
          disabled={loading}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Supervisor Re-baseline
        </Button>

        {/* Result Preview */}
        {result && (
          <div className="rounded-lg bg-muted p-3 text-xs space-y-1">
            <p>👷 People Detected: {result.people_detected}</p>
            <p>⚠️ Violations: {result.violations}</p>
            <p>🪖 Helmet Confidence: {result.helmet_confidence}</p>
            <p>📉 Drift Score: {result.drift_score}</p>
            <p>🧯 Risk Budget: {result.risk_budget}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
