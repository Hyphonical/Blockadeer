"use client"

import { Clock, Plus, Pencil, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const schedules = [
  {
    id: "1",
    name: "Bedtime Restriction",
    target: "Sarah's iPhone",
    ip: "192.168.1.45",
    days: "Mon, Tue, Wed, Thu, Sun",
    time: "21:00 - 06:30",
    policy: "Block All",
    enabled: true,
  },
  {
    id: "2",
    name: "Focus Mode",
    target: "Work Laptop",
    ip: "192.168.1.67",
    days: "Mon, Tue, Wed, Thu, Fri",
    time: "09:00 - 17:00",
    policy: "Block Social Media",
    enabled: true,
  },
  {
    id: "3",
    name: "Dinner Time",
    target: "All Devices",
    ip: "0.0.0.0/0",
    days: "Daily",
    time: "18:00 - 19:30",
    policy: "Block Video Streaming",
    enabled: false,
  },
]

export function SchedulesTable() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Time-Based Schedules</CardTitle>
          <CardDescription>Automatically apply filtering policies based on time and day</CardDescription>
        </div>
        <Button size="sm">
          <Plus className="mr-2 size-3" />
          Add Schedule
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Target Device</TableHead>
              <TableHead>Schedule</TableHead>
              <TableHead>Policy</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.map((schedule) => (
              <TableRow key={schedule.id} className={!schedule.enabled ? "opacity-60" : ""}>
                <TableCell>
                  <Switch checked={schedule.enabled} aria-label="Toggle schedule" />
                </TableCell>
                <TableCell className="font-medium">
                  {schedule.name}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm">{schedule.target}</span>
                    <span className="text-xs text-muted-foreground font-mono">{schedule.ip}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Clock className="size-3.5 text-muted-foreground" />
                      <span>{schedule.time}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{schedule.days}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={schedule.policy === "Block All" ? "destructive" : "outline"} className="font-normal text-[11px] px-2 py-0.5 whitespace-nowrap">
                    {schedule.policy}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" className="size-8 text-muted-foreground">
                      <Pencil className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="size-8 text-muted-foreground hover:text-destructive">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {schedules.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground h-24">
                  No schedules configured
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
