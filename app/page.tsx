"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard-header"
import { SystemStatusCard } from "@/components/system-status-card"
import { RiskBudgetGauge } from "@/components/risk-budget-gauge"
import { DriftTrendChart } from "@/components/drift-trend-chart"
import { ExplainabilityPanel } from "@/components/explainability-panel"
import { ControlActionPanel } from "@/components/control-action-panel"
import { BlackBoxEventLog } from "@/components/black-box-event-log"
import { SupervisorControlPanel } from "@/components/supervisor-control-panel"
import { DriftAttributionTimeline } from "@/components/drift-attribution-timeline"

const API_BASE = "http://127.0.0.1:8000"

export default function DriftSentinelDashboard() {
  const [riskBudget, setRiskBudget] = useState(100)
  const [riskLevel, setRiskLevel] = useState("Low")
  const [actionRequired, setActionRequired] = useState("Monitoring Active")
  const [modelConfidence, setModelConfidence] = useState("Confident")

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await fetch(`${API_BASE}/status`)
      const data = await res.json()

      setRiskBudget(data.risk_budget)
      setRiskLevel(data.risk_level)
      setActionRequired(data.action_required)
      setModelConfidence(data.model_confidence)
    }

    fetchStatus()
    const interval = setInterval(fetchStatus, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleRecalibrate = async () => {
    await fetch(`${API_BASE}/calibrate`, { method: "POST" })
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

          <div className="lg:col-span-2">
            <SystemStatusCard
              riskLevel={riskLevel}
              actionRequired={actionRequired}
              modelConfidence={modelConfidence}
            />
          </div>

          <div className="lg:col-span-1">
            <RiskBudgetGauge externalBudget={riskBudget} />
          </div>

          <div className="lg:col-span-2">
            <DriftTrendChart />
          </div>

          <div className="lg:col-span-1">
            <ExplainabilityPanel />
          </div>

          <div className="lg:col-span-3">
            <DriftAttributionTimeline />
          </div>

          <div className="lg:col-span-3">
            <ControlActionPanel />
          </div>

          <div className="lg:col-span-3">
            <BlackBoxEventLog />
          </div>

          <div className="lg:col-span-3">
            <SupervisorControlPanel onRecalibrate={handleRecalibrate} />
          </div>

        </div>
      </main>

      <footer className="border-t border-border bg-card/50 py-4">
        <p className="text-center text-xs text-muted-foreground">
          System operates without ground-truth labels and prioritizes safe degradation over accuracy.
        </p>
      </footer>
    </div>
  )
}
