import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { QueryLogCard } from "@/components/dashboard/query-log-card"

export default function QueryLogPage() {
  return (
    <>
      <DashboardHeader title="Query Log" />
      <main className="flex-1 overflow-auto p-6 flex flex-col min-h-0">
        <div className="mx-auto max-w-7xl w-full flex-1 flex flex-col min-h-0">
          <QueryLogCard />
        </div>
      </main>
    </>
  )
}
