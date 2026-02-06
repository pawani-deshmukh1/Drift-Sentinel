"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const API_BASE = "http://127.0.0.1:8000"

export function BlackBoxEventLog() {
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch(`${API_BASE}/logs`)
      const data = await res.json()
      setEvents(data.logs || [])
    }

    fetchLogs()
    const interval = setInterval(fetchLogs, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Black Box Event Log</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-64">
          {events.map((e, i) => (
            <div key={i} className="grid grid-cols-4 gap-3 py-2 text-sm border-b">
              <span>{e.timestamp}</span>
              <Badge>{e.severity}</Badge>
              <span>{e.action_taken}</span>
              <span>{e.root_cause}</span>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
