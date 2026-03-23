import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DevicesTable } from "@/components/dashboard/devices-table"

export default function DevicesPage() {
  return (
    <>
      <DashboardHeader title="Devices" />
      <main className="flex-1 overflow-auto p-6 flex flex-col min-h-0">
        <div className="mx-auto max-w-7xl w-full flex-1 flex flex-col space-y-6">
          <DevicesTable />
        </div>
      </main>
    </>
  )
}
