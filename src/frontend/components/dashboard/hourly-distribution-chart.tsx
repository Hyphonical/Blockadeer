"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { hour: "0", queries: 1200 },
  { hour: "1", queries: 800 },
  { hour: "2", queries: 450 },
  { hour: "3", queries: 320 },
  { hour: "4", queries: 280 },
  { hour: "5", queries: 420 },
  { hour: "6", queries: 1800 },
  { hour: "7", queries: 3200 },
  { hour: "8", queries: 4800 },
  { hour: "9", queries: 5200 },
  { hour: "10", queries: 5400 },
  { hour: "11", queries: 4900 },
  { hour: "12", queries: 4200 },
  { hour: "13", queries: 4500 },
  { hour: "14", queries: 5100 },
  { hour: "15", queries: 5600 },
  { hour: "16", queries: 6200 },
  { hour: "17", queries: 6800 },
  { hour: "18", queries: 7200 },
  { hour: "19", queries: 6400 },
  { hour: "20", queries: 5200 },
  { hour: "21", queries: 4100 },
  { hour: "22", queries: 2800 },
  { hour: "23", queries: 1800 },
]

const chartConfig = {
  queries: {
    label: "Queries",
    color: "var(--chart-color)",
  },
} satisfies ChartConfig

export function HourlyDistributionChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hourly Distribution</CardTitle>
        <CardDescription>Query volume by hour of day</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px] w-full">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis
              dataKey="hour"
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}h`}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="queries"
              fill="var(--chart-color)"
              radius={[4, 4, 0, 0]}
              strokeWidth={0}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
