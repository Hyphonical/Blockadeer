import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DatabaseSettings } from "@/components/dashboard/database-settings"

export default function DatabasePage() {
  return (
    <>
      <DashboardHeader title="Database" />
      <main className="flex-1 overflow-auto p-6 flex flex-col min-h-0">
        <div className="mx-auto max-w-7xl w-full flex-1 flex flex-col space-y-6">
          <DatabaseSettings />
        </div>
      </main>
    </>
  )
}
