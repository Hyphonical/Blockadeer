"use client"

import { Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState } from "react"

interface CustomRule {
  domain: string
  type: "Exact" | "Wildcard"
  action: "blocked" | "allowed"
  createdAt: string
}

const defaultRules: CustomRule[] = [
  {
    domain: "ads.example.com",
    type: "Exact",
    action: "blocked",
    createdAt: "2 days ago",
  },
  {
    domain: "important-service.internal",
    type: "Exact",
    action: "allowed",
    createdAt: "1 week ago",
  },
  {
    domain: "*.tracker.net",
    type: "Wildcard",
    action: "blocked",
    createdAt: "1 month ago",
  },
]

export function CustomRulesTable() {
  const [rules, setRules] = useState<CustomRule[]>(defaultRules)

  const deleteRule = (domain: string) => {
    setRules((prev) => prev.filter((r) => r.domain !== domain))
  }

  const addRule = () => {
    const newRule: CustomRule = {
      domain: "new-rule.example.com",
      type: "Exact",
      action: "blocked",
      createdAt: "Just now",
    }
    setRules((prev) => [newRule, ...prev])
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Custom Rules</CardTitle>
          <CardDescription>Locally enforced DNS overrides matching domains or wildcards</CardDescription>
        </div>
        <Button size="sm" onClick={addRule}>
          <Plus className="mr-2 size-3" />
          Add Rule
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Domain Pattern</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rules.map((rule) => (
              <TableRow key={rule.domain}>
                <TableCell className="font-mono text-sm">
                  {rule.domain}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {rule.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={rule.action === "blocked" ? "secondary" : "default"}>
                    {rule.action}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {rule.createdAt}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => deleteRule(rule.domain)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {rules.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                  No custom rules defined
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
