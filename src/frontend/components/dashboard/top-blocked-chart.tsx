"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { domain: "doubleclick.net", count: 12420 },
  { domain: "googlesyndication.com", count: 9834 },
  { domain: "facebook.com/tr", count: 8234 },
  { domain: "analytics.google.com", count: 7123 },
  { domain: "adservice.google.com", count: 6892 },
  { domain: "amazon-adsystem.com", count: 5234 },
  { domain: "adsrvr.org", count: 4892 },
  { domain: "criteo.com", count: 4123 },
]

const chartConfig = {
  count: {
    label: "Blocked",
    color: "var(--chart-color)",
  },
} satisfies ChartConfig

export function TopBlockedChart() {
  return (
    <Card className="col-span-full lg:col-span-1">
      <CardHeader>
        <CardTitle>Top Blocked Domains</CardTitle>
        <CardDescription>Most frequently blocked today</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
          >
            <XAxis
              type="number"
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            <YAxis
              type="category"
              dataKey="domain"
              stroke="var(--muted-foreground)"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              width={120}
              tickFormatter={(value) => value.length > 16 ? `${value.slice(0, 16)}...` : value}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="count"
              fill="var(--chart-color)"
              radius={[0, 4, 4, 0]}
              strokeWidth={0}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
