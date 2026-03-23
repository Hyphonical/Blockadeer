"use client"

import { Plus, Pencil, Trash2, GripVertical, Server, Shield, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
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

const upstreamServers = [
  {
    id: "1",
    name: "Cloudflare",
    address: "https://cloudflare-dns.com/dns-query",
    protocol: "DoH",
    status: "Active",
    latency: "8ms",
    enabled: true,
  },
  {
    id: "2",
    name: "Quad9",
    address: "tls://dns.quad9.net",
    protocol: "DoT",
    status: "Active",
    latency: "12ms",
    enabled: true,
  },
  {
    id: "3",
    name: "Google Public DNS",
    address: "8.8.8.8",
    protocol: "UDP",
    status: "Fallback",
    latency: "4ms",
    enabled: false,
  },
]

export function UpstreamDnsSettings() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle>Upstream Servers</CardTitle>
            <CardDescription>Configure external DNS resolvers and their priority</CardDescription>
          </div>
          <Button size="sm">
            <Plus className="mr-2 size-3" />
            Add Resolver
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Resolver Details</TableHead>
                <TableHead>Protocol</TableHead>
                <TableHead>Latency</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {upstreamServers.map((server, index) => (
                <TableRow key={server.id} className={!server.enabled ? "opacity-60" : ""}>
                  <TableCell>
                    <GripVertical className="size-4 text-muted-foreground cursor-move hover:text-foreground" />
                  </TableCell>
                  <TableCell>
                    <Switch checked={server.enabled} aria-label="Toggle resolver" />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{server.name}</span>
                      <span className="text-xs text-muted-foreground font-mono">{server.address}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="font-mono text-[10px] px-1.5 py-0 uppercase">
                      {server.protocol}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Activity className="size-3.5" />
                      <span className="tabular-nums">{server.latency}</span>
                    </div>
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
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="bg-muted/50 border-t px-6 py-3">
          <p className="text-xs text-muted-foreground">
            Resolvers are queried in order based on the Failover Strategy configuration.
          </p>
        </CardFooter>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Server className="size-5 text-muted-foreground" />
              <CardTitle className="text-base">Failover Strategy</CardTitle>
            </div>
            <CardDescription>Determine how Blockadeer routes queries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Strict Order (Sequential)</div>
                <div className="text-xs text-muted-foreground">Try primary first, fallback on timeout</div>
              </div>
              <Switch checked={true} />
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4 opacity-50">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Parallel Resolution</div>
                <div className="text-xs text-muted-foreground">Query all active servers, respond with fastest</div>
              </div>
              <Switch checked={false} disabled />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="size-5 text-muted-foreground" />
              <CardTitle className="text-base">Advanced DNS Settings</CardTitle>
            </div>
            <CardDescription>Global resolver configurations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Enable DNSSEC Validation</div>
                <div className="text-xs text-muted-foreground">Verify cryptographic signatures</div>
              </div>
              <Switch checked={true} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">EDNS Client Subnet (ECS)</div>
                <div className="text-xs text-muted-foreground">Forward client prefix for routing</div>
              </div>
              <Switch checked={false} />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Use Local Cache</div>
                <div className="text-xs text-muted-foreground">Cache upstream responses to memory</div>
              </div>
              <Switch checked={true} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
