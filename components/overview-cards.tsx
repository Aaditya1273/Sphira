"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, Zap, Lock } from "lucide-react"

export function OverviewCards() {
  const stats = [
    {
      title: "Total Portfolio Value",
      value: "$124,567.89",
      change: "+12.5%",
      changeType: "positive" as const,
      icon: DollarSign,
      description: "Across all SIPs and yield pools",
    },
    {
      title: "Active SIPs",
      value: "8",
      change: "+2 this month",
      changeType: "positive" as const,
      icon: TrendingUp,
      description: "Automated investment plans",
    },
    {
      title: "Yield Earned",
      value: "$3,247.12",
      change: "+8.3%",
      changeType: "positive" as const,
      icon: Zap,
      description: "Total yield from optimization",
    },
    {
      title: "Emergency Funds",
      value: "$25,000.00",
      change: "Locked",
      changeType: "neutral" as const,
      icon: Lock,
      description: "Secured in emergency vault",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="relative overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center space-x-2 mt-1">
              <Badge
                variant={
                  stat.changeType === "positive"
                    ? "default"
                    : stat.changeType === "negative"
                      ? "destructive"
                      : "secondary"
                }
                className="text-xs"
              >
                {stat.changeType === "positive" && <TrendingUp className="h-3 w-3 mr-1" />}
                {stat.changeType === "negative" && <TrendingDown className="h-3 w-3 mr-1" />}
                {stat.change}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
