"use client"

import { Monitor, Smartphone, Tv, Laptop, Router } from "lucide-react"
import { useDashboardWS } from "@/hooks/use-dashboard-ws"
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

const deviceIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Sarah's iPhone": Smartphone,
  "Living Room TV": Tv,
  "Work Laptop": Laptop,
  "Desktop PC": Monitor,
  "IoT Hub": Router,
}

export function DevicesTable() {
  const { devices } = useDashboardWS("devices")
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
            {devices.map((device) => {
              const IconComponent = deviceIcons[device.name] || Monitor
              return (
                <TableRow key={device.ip}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex size-8 items-center justify-center rounded-md bg-muted">
                        <IconComponent className="size-4 text-muted-foreground" />
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
                    {device.queries > 0 ? ((device.blocked / device.queries) * 100).toFixed(1) : '0'}%
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
