import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { GlobalSettings } from "@/components/dashboard/global-settings"

export default function SettingsPage() {
  return (
    <>
      <DashboardHeader title="Settings" />
      <main className="flex-1 overflow-auto p-6 flex flex-col min-h-0">
        <div className="mx-auto max-w-7xl w-full flex-1 flex flex-col space-y-6">
          <GlobalSettings />
        </div>
      </main>
    </>
  )
}
