"use client"

import { Activity, Ban, Database, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const stats = [
  {
    title: "Total Queries",
    value: "1,284,392",
    change: "+12.5%",
    changeLabel: "from last week",
    icon: Activity,
  },
  {
    title: "Blocked",
    value: "342,847",
    change: "26.7%",
    changeLabel: "block rate",
    icon: Ban,
  },
  {
    title: "Cache Hits",
    value: "892,103",
    change: "69.4%",
    changeLabel: "hit rate",
    icon: Database,
  },
  {
    title: "Avg Latency",
    value: "1.8ms",
    change: "-0.3ms",
    changeLabel: "from yesterday",
    icon: Zap,
  },
]

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{stat.change}</span>{" "}
              {stat.changeLabel}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
