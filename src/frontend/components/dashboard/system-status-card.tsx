"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Cpu, HardDrive, CircuitBoard, Timer } from "lucide-react"

const systemStats = [
  {
    label: "Uptime",
    value: "14d 6h 32m",
    icon: Timer,
  },
  {
    label: "Memory",
    value: "48 MB / 100 MB",
    icon: CircuitBoard,
  },
  {
    label: "CPU",
    value: "12%",
    icon: Cpu,
  },
  {
    label: "Database",
    value: "234 MB",
    icon: HardDrive,
  },
]

const upstreamServers = [
  { name: "Cloudflare DoH", status: "primary", latency: "8ms" },
  { name: "Quad9 DoH", status: "secondary", latency: "12ms" },
  { name: "1.1.1.1", status: "fallback", latency: "4ms" },
]

export function SystemStatusCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>System Status</CardTitle>
        <CardDescription>Server health and performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          {systemStats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-muted">
                <stat.icon className="size-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground">{stat.label}</span>
                <span className="text-sm font-medium">{stat.value}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium">Upstream DNS Servers</h4>
          <div className="space-y-2">
            {upstreamServers.map((server) => (
              <div
                key={server.name}
                className="flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2"
              >
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-foreground" />
                  <span className="text-sm">{server.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{server.status}</span>
                  <span className="text-xs tabular-nums font-mono">{server.latency}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
