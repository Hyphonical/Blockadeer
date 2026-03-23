"use client"

import { Monitor, Smartphone, Tv, Laptop, Router } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

function formatNumber(n: number): string {
  return n.toLocaleString("en-US")
}

const devices = [
  {
    name: "Sarah's iPhone",
    ip: "192.168.1.45",
    queries: 15234,
    blocked: 4201,
    icon: Smartphone,
    status: "active",
    policy: "Restricted (Bedtime)",
  },
  {
    name: "Living Room TV",
    ip: "192.168.1.102",
    queries: 8923,
    blocked: 3892,
    icon: Tv,
    status: "active",
    policy: "Default",
  },
  {
    name: "Work Laptop",
    ip: "192.168.1.67",
    queries: 12456,
    blocked: 2134,
    icon: Laptop,
    status: "active",
    policy: "Custom Rules",
  },
  {
    name: "Desktop PC",
    ip: "192.168.1.23",
    queries: 6789,
    blocked: 1567,
    icon: Monitor,
    status: "idle",
    policy: "Default",
  },
  {
    name: "IoT Hub",
    ip: "192.168.1.200",
    queries: 2345,
    blocked: 1890,
    icon: Router,
    status: "active",
    policy: "Strict",
  },
]

export function DevicesTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Devices</CardTitle>
        <CardDescription>Network devices using Blockadeer DNS</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Device</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead>Policy</TableHead>
              <TableHead className="text-right">Queries</TableHead>
              <TableHead className="text-right">Blocked</TableHead>
              <TableHead className="text-right">Block Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {devices.map((device) => (
              <TableRow key={device.ip}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-md bg-muted">
                      <device.icon className="size-4 text-muted-foreground" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium">{device.name}</span>
                      <Badge variant={device.status === "active" ? "default" : "secondary"} className="w-fit text-[10px] px-1.5 py-0">
                        {device.status}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-sm text-muted-foreground">
                  {device.ip}
                </TableCell>
                <TableCell>
                  <Badge variant={device.policy === "Default" ? "outline" : "secondary"} className="text-[10px] px-1.5 py-0 font-medium">
                    {device.policy}
                  </Badge>
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatNumber(device.queries)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatNumber(device.blocked)}
                </TableCell>
                <TableCell className="text-right tabular-nums font-medium">
                  {((device.blocked / device.queries) * 100).toFixed(1)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
