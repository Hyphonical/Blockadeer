"use client"

import { Calendar, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"

interface DashboardHeaderProps {
  title?: string
}

const timeRanges = [
  { label: "Last hour", value: "last-hour" },
  { label: "Last 24 hours", value: "last-24-hours" },
  { label: "Last 7 days", value: "last-7-days" },
  { label: "Last 30 days", value: "last-30-days" },
]

export function DashboardHeader({ title = "Overview" }: DashboardHeaderProps) {
  const [timeRange, setTimeRange] = useState("last-24-hours")
  const selectedLabel = timeRanges.find((r) => r.value === timeRange)?.label ?? "Last 24 hours"

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <Calendar className="mr-2 size-3.5" />
              {selectedLabel}
              <ChevronDown className="ml-2 size-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {timeRanges.map((range) => (
              <DropdownMenuItem
                key={range.value}
                onClick={() => setTimeRange(range.value)}
                className={timeRange === range.value ? "bg-accent" : ""}
              >
                {range.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
