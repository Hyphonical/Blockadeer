import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { QueriesChart } from "@/components/dashboard/queries-chart"
import { TopBlockedChart } from "@/components/dashboard/top-blocked-chart"
import { DevicesTable } from "@/components/dashboard/devices-table"
import { BlocklistsCard } from "@/components/dashboard/blocklists-card"
import { QueryLogCard } from "@/components/dashboard/query-log-card"
import { HourlyDistributionChart } from "@/components/dashboard/hourly-distribution-chart"
import { SystemStatusCard } from "@/components/dashboard/system-status-card"

export default function DashboardPage() {
  return (
    <>
      <DashboardHeader title="Overview" />
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
            {/* Stats Overview */}
            <StatsCards />

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-3 [&>*]:min-w-0">
              <QueriesChart />
              <TopBlockedChart />
            </div>

            {/* Secondary Row */}
            <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch [&>*]:min-w-0">
              <QueryLogCard />
              <div className="flex min-w-0 flex-col space-y-6">
                <HourlyDistributionChart />
                <BlocklistsCard />
              </div>
            </div>

          {/* Devices and System */}
          <div className="grid gap-6 lg:grid-cols-3 [&>*]:min-w-0">
            <div className="min-w-0 lg:col-span-2">
              <DevicesTable />
            </div>
            <SystemStatusCard />
          </div>
        </div>
      </main>
    </>
  )
}
