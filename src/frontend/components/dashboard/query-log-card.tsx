"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

const recentQueries = [
  {
    domain: "api.spotify.com",
    type: "A",
    action: "allowed",
    latency: "1.2ms",
    time: "2s ago",
  },
  {
    domain: "doubleclick.net",
    type: "A",
    action: "blocked",
    latency: "0.1ms",
    time: "3s ago",
    list: "OISD-Full",
  },
  {
    domain: "www.google.com",
    type: "AAAA",
    action: "cached",
    latency: "0.3ms",
    time: "5s ago",
  },
  {
    domain: "analytics.tiktok.com",
    type: "A",
    action: "blocked",
    latency: "0.1ms",
    time: "8s ago",
    list: "Hagezi-Normal",
  },
  {
    domain: "cdn.jsdelivr.net",
    type: "A",
    action: "allowed",
    latency: "2.1ms",
    time: "12s ago",
  },
  {
    domain: "graph.facebook.com",
    type: "A",
    action: "blocked",
    latency: "0.1ms",
    time: "15s ago",
    list: "StevenBlack",
  },
  {
    domain: "api.github.com",
    type: "A",
    action: "cached",
    latency: "0.2ms",
    time: "18s ago",
  },
  {
    domain: "amazon-adsystem.com",
    type: "A",
    action: "blocked",
    latency: "0.1ms",
    time: "22s ago",
    list: "OISD-Full",
  },
]

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
            {recentQueries.map((query, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border bg-muted/30 p-3"
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm">{query.domain}</span>
                    <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                      {query.type}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{query.time}</span>
                    {query.list && (
                      <>
                        <span>•</span>
                        <span>{query.list}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs tabular-nums text-muted-foreground">
                    {query.latency}
                  </span>
                  <Badge variant={getActionBadgeVariant(query.action)}>
                    {query.action}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
        </div>
      </CardContent>
    </Card>
  )
}
