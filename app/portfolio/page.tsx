import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, DollarSign, PieChart } from "lucide-react"

export default function PortfolioPage() {
  const allocations = [
    { name: "USDC SIPs", value: 45000, percentage: 36, change: "+5.2%" },
    { name: "ETH SIPs", value: 38000, percentage: 30, change: "+12.8%" },
    { name: "SOM SIPs", value: 25000, percentage: 20, change: "+8.1%" },
    { name: "Yield Pools", value: 17000, percentage: 14, change: "+15.3%" },
  ]

  const totalValue = allocations.reduce((sum, item) => sum + item.value, 0)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Portfolio Overview</h1>
          <p className="text-muted-foreground text-pretty">
            Comprehensive view of your DeFi investments and allocations
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Asset Allocation
              </CardTitle>
              <CardDescription>Distribution across different investment types</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {allocations.map((allocation) => (
                <div key={allocation.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{allocation.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">${allocation.value.toLocaleString()}</span>
                      <Badge variant={allocation.change.startsWith("+") ? "default" : "destructive"}>
                        {allocation.change}
                      </Badge>
                    </div>
                  </div>
                  <Progress value={allocation.percentage} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Portfolio Summary
              </CardTitle>
              <CardDescription>Key metrics and performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">24h Change</p>
                  <p className="text-2xl font-bold text-green-600 flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    +8.7%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Monthly Yield</p>
                  <p className="text-lg font-semibold">$2,847.32</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active SIPs</p>
                  <p className="text-lg font-semibold">8 running</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
