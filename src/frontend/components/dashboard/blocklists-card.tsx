"use client"

import { RefreshCw, Check } from "lucide-react"
import { useDashboardWS } from "@/hooks/use-dashboard-ws"
import { cn } from "@/lib/utils"

function formatNumber(n: number): string {
  return n.toLocaleString("en-US")
}
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"

export function BlocklistsCard() {
  const { blocklists } = useDashboardWS("blocklists")

  const totalDomains = blocklists.reduce((acc, list) => acc + list.domains, 0)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Blocklists</CardTitle>
          <CardDescription>
            {formatNumber(totalDomains)} domains across {blocklists.length} lists
          </CardDescription>
        </div>
        <Button variant="outline" size="sm" disabled>
          <RefreshCw className="mr-2 size-3" />
          Live
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {blocklists.map((list) => (
          <div key={list.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Check className="size-3 text-muted-foreground" />
                <span className="text-sm font-medium">{list.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {formatNumber(list.domains)} domains
              </span>
            </div>
            <Progress 
              value={totalDomains > 0 ? (list.domains / totalDomains) * 100 : 0}
              className="h-1.5"
            />
            <p className="text-xs text-muted-foreground">
              Updated {list.lastUpdated}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
