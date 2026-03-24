"use client"

import { useMemo } from "react"
import { Activity, Ban, Database, Zap } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDashboardWS } from "@/hooks/use-dashboard-ws"

export function StatsCards() {
  const { stats } = useDashboardWS("dashboard")

  const statCards = useMemo(() => {
    if (!stats) return []
    return [
      {
        title: "Total Queries",
        value: stats.total_queries.toLocaleString("en-US"),
        icon: Activity,
      },
      {
        title: "Blocked",
        value: stats.blocked.toLocaleString("en-US"),
        change: `${stats.block_rate.toFixed(1)}%`,
        changeLabel: "block rate",
        icon: Ban,
      },
      {
        title: "Cache Hits",
        value: stats.cache_hits.toLocaleString("en-US"),
        change: `${stats.cache_hit_rate.toFixed(1)}%`,
        changeLabel: "hit rate",
        icon: Database,
      },
      {
        title: "Avg Latency",
        value: `${stats.avg_latency_ms.toFixed(1)}ms`,
        icon: Zap,
      },
    ]
  }, [stats])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {stat.title}
            </CardTitle>
            <stat.icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {("change" in stat) && (
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{stat.change}</span>{" "}
                {stat.changeLabel}
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
