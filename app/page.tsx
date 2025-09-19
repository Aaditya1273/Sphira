import { DashboardLayout } from "@/components/dashboard-layout"
import { OverviewCards } from "@/components/overview-cards"
import { SIPChart } from "@/components/sip-chart"
import { RecentActivity } from "@/components/recent-activity"
import { YieldOptimizer } from "@/components/yield-optimizer"

export default function HomePage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Welcome to Sphira</h1>
          <p className="text-muted-foreground text-pretty">Your advanced DeFi SIP platform on Somnia blockchain</p>
        </div>

        <OverviewCards />

        <div className="grid gap-6 md:grid-cols-2">
          <SIPChart />
          <YieldOptimizer />
        </div>

        <RecentActivity />
      </div>
    </DashboardLayout>
  )
}
