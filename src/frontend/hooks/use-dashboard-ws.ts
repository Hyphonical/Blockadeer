import { useEffect, useState, useCallback } from 'react'

interface DashboardStats {
  total_queries: number
  blocked: number
  cache_hits: number
  avg_latency_ms: number
  block_rate: number
  cache_hit_rate: number
}

interface QueryEntry {
  domain: string
  query_type: string
  action: 'allowed' | 'blocked' | 'cached'
  latency_ms: number
}

interface Device {
  name: string
  ip: string
  queries: number
  blocked: number
  status: 'active' | 'idle'
  policy: string
}

interface Blocklist {
  name: string
  domains: number
  lastUpdated: string
  enabled: boolean
}

interface WebSocketMessage {
  type: 'stats' | 'query' | 'devices' | 'blocklists'
  data: DashboardStats | QueryEntry | Device[] | Blocklist[]
}

export function useDashboardWS(page: string) {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [queries, setQueries] = useState<QueryEntry[]>([])
  const [devices, setDevices] = useState<Device[]>([])
  const [blocklists, setBlocklists] = useState<Blocklist[]>([])
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
    const ws = new WebSocket(`${protocol}://${window.location.host}/api/ws`)

    ws.onopen = () => {
      setConnected(true)
      // Send page info to backend
      ws.send(JSON.stringify({ page }))
    }

    ws.onmessage = (event) => {
      try {
        const message: WebSocketMessage = JSON.parse(event.data)

        if (message.type === 'stats') {
          setStats(message.data as DashboardStats)
        } else if (message.type === 'query') {
          setQueries((prev) => {
            const updated = [message.data as QueryEntry, ...prev]
            // Keep last 50 queries
            return updated.slice(0, 50)
          })
        } else if (message.type === 'devices') {
          setDevices(message.data as Device[])
        } else if (message.type === 'blocklists') {
          setBlocklists(message.data as Blocklist[])
        }
      } catch (e) {
        console.error('Failed to parse WebSocket message:', e)
      }
    }

    ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      setConnected(false)
    }

    ws.onclose = () => {
      setConnected(false)
    }

    return () => {
      ws.close()
    }
  }, [page])

  return { stats, queries, devices, blocklists, connected }
}
