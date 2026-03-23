import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { UpstreamDnsSettings } from "@/components/dashboard/upstream-dns-settings"

export default function UpstreamDnsPage() {
  return (
    <>
      <DashboardHeader title="Upstream DNS" />
      <main className="flex-1 overflow-auto p-6 flex flex-col min-h-0">
        <div className="mx-auto max-w-7xl w-full flex-1 space-y-6">
          <UpstreamDnsSettings />
        </div>
      </main>
    </>
  )
}
