"use client"

import { useState } from "react"
import { Cpu, Globe, Lock, Network, ShieldCheck, Check } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

export function GlobalSettings() {
  const [dnsEnabled, setDnsEnabled] = useState(true)
  const [dotEnabled, setDotEnabled] = useState(true)
  const [dohEnabled, setDohEnabled] = useState(true)
  const [reuseportEnabled, setReuseportEnabled] = useState(true)
  const [bindingsApplied, setBindingsApplied] = useState(false)
  const [passwordUpdated, setPasswordUpdated] = useState(false)
  const [apiToken, setApiToken] = useState("bd_tk_7x...a1z9")
  const [tokenGenerated, setTokenGenerated] = useState(false)

  const applyBindings = () => {
    setBindingsApplied(true)
    setTimeout(() => setBindingsApplied(false), 2000)
  }

  const updatePassword = () => {
    setPasswordUpdated(true)
    setTimeout(() => setPasswordUpdated(false), 2000)
  }

  const generateToken = () => {
    const newToken = `bd_tk_${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`
    setApiToken(newToken)
    setTokenGenerated(true)
    setTimeout(() => setTokenGenerated(false), 2000)
  }

  const revokeToken = () => {
    setApiToken("")
    setTokenGenerated(true)
    setTimeout(() => setTokenGenerated(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Network Bound Interfaces */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <Network className="size-5 text-muted-foreground" />
              <CardTitle>Network Interfaces</CardTitle>
            </div>
            <CardDescription>Configure which addresses the DNS server binds to</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Local IPv4 Bind</Label>
                <Input defaultValue="0.0.0.0" />
              </div>
              <div className="space-y-2">
                <Label>Local IPv6 Bind</Label>
                <Input defaultValue="::" />
              </div>
            </div>
            <Separator />
            <div className="space-y-4 pt-2">
              <Label className="text-muted-foreground uppercase text-xs tracking-wider">Listening Ports</Label>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">DNS UDP/TCP</div>
                  <div className="text-xs text-muted-foreground">Standard DNS protocol</div>
                </div>
                <div className="flex items-center gap-3">
                  <Input defaultValue="53" className="w-20 no-spinner" type="number" />
                  <Switch checked={dnsEnabled} onCheckedChange={setDnsEnabled} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">DoT (DNS over TLS)</div>
                  <div className="text-xs text-muted-foreground">Requires valid SSL certificates</div>
                </div>
                <div className="flex items-center gap-3">
                  <Input defaultValue="853" className="w-20 no-spinner" type="number" />
                  <Switch checked={dotEnabled} onCheckedChange={setDotEnabled} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="text-sm font-medium">DoH (DNS over HTTPS)</div>
                  <div className="text-xs text-muted-foreground">Serves over standard web port</div>
                </div>
                <div className="flex items-center gap-3">
                  <Input defaultValue="443" className="w-20 no-spinner" type="number" />
                  <Switch checked={dohEnabled} onCheckedChange={setDohEnabled} />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-muted/50 border-t px-6 py-3">
            <Button variant="outline" size="sm" onClick={applyBindings}>
              {bindingsApplied ? (
                <>
                  <Check className="mr-2 size-4" />
                  Applied!
                </>
              ) : (
                "Apply Server Bindings"
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Performance & Tuning */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <Cpu className="size-5 text-muted-foreground" />
              <CardTitle>Performance Tuning</CardTitle>
            </div>
            <CardDescription>Adjust runtime properties mapped to system hardware</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Tokio Worker Threads</Label>
                <span className="text-xs text-muted-foreground tabular-nums">Current: 4 (Max: 8)</span>
              </div>
              <div className="flex items-center gap-3">
                <Input type="number" defaultValue="4" max="8" min="1" className="w-24 no-spinner" />
                <span className="text-sm text-muted-foreground">Set to match logical CPU cores</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-4 pt-2">
              <Label className="text-muted-foreground uppercase text-xs tracking-wider">Rate Limiting (Per-IP)</Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-normal">Token Bucket Size</Label>
                  <Input type="number" defaultValue="100" className="no-spinner" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-normal">Refill Rate (Req/s)</Label>
                  <Input type="number" defaultValue="20" className="no-spinner" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <div className="text-sm font-medium">SO_REUSEPORT</div>
                <div className="text-xs text-muted-foreground">Load balance UDP across worker threads</div>
              </div>
              <Switch checked={reuseportEnabled} onCheckedChange={setReuseportEnabled} />
            </div>
          </CardContent>
        </Card>

        {/* Security & Access */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="size-5 text-muted-foreground" />
              <CardTitle>Security & API Access</CardTitle>
            </div>
            <CardDescription>Manage Dashboard login credentials and automated API tokens</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Web Interface</h4>
                <div className="space-y-2">
                  <Label>Management Port</Label>
                  <Input type="number" defaultValue="8000" className="w-32 no-spinner" />
                </div>
                <div className="space-y-2">
                  <Label>Change Admin Password</Label>
                  <Input type="password" placeholder="New Password" />
                  <Input type="password" placeholder="Confirm Password" />
                </div>
                <Button size="sm" variant="secondary" onClick={updatePassword}>
                  {passwordUpdated ? (
                    <>
                      <Check className="mr-2 size-4" />
                      Updated!
                    </>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">REST API Tokens</h4>
                <p className="text-xs text-muted-foreground">
                  Use bearer tokens to access the Blockadeer settings and endpoints externally.
                </p>
                <div className="space-y-2">
                  {apiToken ? (
                    <div className="flex items-center justify-between rounded-md border px-3 py-2 text-sm font-mono bg-muted/30">
                      <span>{apiToken}</span>
                      <Button variant="ghost" size="sm" className="h-6 text-xs text-destructive" onClick={revokeToken}>Revoke</Button>
                    </div>
                  ) : (
                    <div className="rounded-md border px-3 py-2 text-sm text-muted-foreground">
                      No token generated
                    </div>
                  )}
                </div>
                <Button size="sm" variant="outline" className="w-full" onClick={generateToken}>
                  {tokenGenerated ? (
                    <>
                      <Check className="mr-2 size-4" />
                      Generated!
                    </>
                  ) : (
                    "Generate New Token"
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
