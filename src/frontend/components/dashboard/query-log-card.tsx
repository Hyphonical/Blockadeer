"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useDashboardWS } from "@/hooks/use-dashboard-ws"

function getActionBadgeVariant(action: string) {
  switch (action) {
    case "blocked":
      return "secondary"
    case "allowed":
      return "default"
    case "cached":
      return "outline"
    default:
      return "secondary"
  }
}

export function QueryLogCard() {
  const { queries } = useDashboardWS("dashboard")

  return (
    <Card className="flex h-full min-h-[400px] flex-col lg:min-h-0">
      <CardHeader>
        <CardTitle>Live Query Log</CardTitle>
        <CardDescription>Real-time DNS query stream</CardDescription>
      </CardHeader>
      <CardContent className="relative flex-1 p-0">
        <div className="absolute inset-0 px-6">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-3 pb-6">
              {queries.length > 0 ? (
                queries.map((query, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg border bg-muted/30 p-3"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{query.domain}</span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                          {query.query_type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>just now</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {query.latency_ms.toFixed(1)}ms
                      </span>
                      <Badge variant={getActionBadgeVariant(query.action)}>
                        {query.action}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  Connecting to server...
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}
