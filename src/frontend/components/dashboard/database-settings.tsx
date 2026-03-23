"use client"

import { Database, HardDrive, Archive, Download, Upload, Trash2, RefreshCw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"

export function DatabaseSettings() {
  return (
    <div className="space-y-6">
      {/* Database Stats Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <HardDrive className="size-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Database Size</span>
                <span className="text-2xl font-bold">234 MB</span>
              </div>
            </div>
            <div className="mt-4 space-y-1">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Storage usage</span>
                <span>23.4% of 1 GB limit</span>
              </div>
              <Progress value={23.4} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Archive className="size-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">WAL Size</span>
                <span className="text-2xl font-bold">12 MB</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Write-Ahead Log size. Checkpoints occur automatically.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                <Database className="size-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium">Query Logs</span>
                <span className="text-2xl font-bold">1.2M</span>
              </div>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Rows stored in the query history table.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Retention Policy */}
        <Card>
          <CardHeader>
            <CardTitle>Data Retention</CardTitle>
            <CardDescription>Configure how long historical data is kept</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label>Query Log Retention (Days)</Label>
              <div className="flex items-center gap-3">
                <Input type="number" defaultValue="30" className="w-24" />
                <span className="text-sm text-muted-foreground">Keep detailed query logs for 30 days</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <Label>Analytics Retention (Days)</Label>
              <div className="flex items-center gap-3">
                <Input type="number" defaultValue="90" className="w-24" />
                <span className="text-sm text-muted-foreground">Keep aggregated statistics for 90 days</span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">Auto-Prune Background Job</div>
                <div className="text-xs text-muted-foreground">Run daily cleanup at 02:00 AM</div>
              </div>
              <Switch checked={true} />
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50 border-t px-6 py-3">
            <Button variant="outline" size="sm">Save Retention Settings</Button>
          </CardFooter>
        </Card>

        <div className="space-y-6">
          {/* Maintenance Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Actions</CardTitle>
              <CardDescription>Perform manual database operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <RefreshCw className="mr-2 size-4 text-muted-foreground" />
                <div className="flex flex-col items-start text-left">
                  <span>Flush WAL (Checkpoint)</span>
                  <span className="text-xs font-normal text-muted-foreground">Moves WAL data into main database file</span>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Database className="mr-2 size-4 text-muted-foreground" />
                <div className="flex flex-col items-start text-left">
                  <span>Optimize Database (Vacuum)</span>
                  <span className="text-xs font-normal text-muted-foreground">Reclaims unallocated space and defragments</span>
                </div>
              </Button>
              <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 border-destructive/20">
                <Trash2 className="mr-2 size-4" />
                <div className="flex flex-col items-start text-left">
                  <span>Purge All Query Logs</span>
                  <span className="text-xs font-normal opacity-80">Irreversibly deletes all stored query histories</span>
                </div>
              </Button>
            </CardContent>
          </Card>

          {/* Backup */}
          <Card>
            <CardHeader>
              <CardTitle>Backup & Restore</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button className="flex-1">
                <Download className="mr-2 size-4" />
                Export DB
              </Button>
              <Button variant="outline" className="flex-1">
                <Upload className="mr-2 size-4" />
                Import DB
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
