"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Calendar, DollarSign, Target } from "lucide-react"

export function SIPStats() {
  const stats = [
    {
      title: "Active SIPs",
      value: "8",
      icon: TrendingUp,
      description: "Currently running",
    },
    {
      title: "Total Invested",
      value: "$53,000",
      icon: DollarSign,
      description: "Across all SIPs",
    },
    {
      title: "Next Execution",
      value: "Tomorrow",
      icon: Calendar,
      description: "3 SIPs scheduled",
    },
    {
      title: "Target Progress",
      value: "67%",
      icon: Target,
      description: "Average completion",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
