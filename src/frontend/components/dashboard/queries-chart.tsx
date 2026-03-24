"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { time: "00:00", allowed: 2400, blocked: 890 },
  { time: "02:00", allowed: 1398, blocked: 620 },
  { time: "04:00", allowed: 980, blocked: 420 },
  { time: "06:00", allowed: 3908, blocked: 1200 },
  { time: "08:00", allowed: 4800, blocked: 1800 },
  { time: "10:00", allowed: 5200, blocked: 2100 },
  { time: "12:00", allowed: 4100, blocked: 1600 },
  { time: "14:00", allowed: 4800, blocked: 1900 },
  { time: "16:00", allowed: 5300, blocked: 2200 },
  { time: "18:00", allowed: 6200, blocked: 2500 },
  { time: "20:00", allowed: 5100, blocked: 2000 },
  { time: "22:00", allowed: 3200, blocked: 1100 },
]

const chartConfig = {
  allowed: {
    label: "Allowed",
    color: "var(--chart-color)",
  },
  blocked: {
    label: "Blocked",
    color: "var(--chart-color)",
  },
} satisfies ChartConfig

export function QueriesChart() {
  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>DNS Queries</CardTitle>
        <CardDescription>Query volume over the last 24 hours</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="time"
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="blocked"
              stackId="1"
              stroke="var(--chart-color)"
              fill="var(--chart-color)"
              fillOpacity={0.25}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="allowed"
              stackId="1"
              stroke="var(--chart-color)"
              fill="var(--chart-color)"
              fillOpacity={0.15}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
