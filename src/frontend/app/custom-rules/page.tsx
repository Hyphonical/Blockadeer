import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { CustomRulesTable } from "@/components/dashboard/custom-rules-table"

export default function CustomRulesPage() {
  return (
    <>
      <DashboardHeader title="Custom Rules" />
      <main className="flex-1 overflow-auto p-6 flex flex-col min-h-0">
        <div className="mx-auto max-w-7xl w-full flex-1 flex flex-col space-y-6">
          <CustomRulesTable />
        </div>
      </main>
    </>
  )
}
