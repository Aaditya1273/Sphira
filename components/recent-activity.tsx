"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ArrowUpRight, ArrowDownRight, Zap, Lock, TrendingUp } from "lucide-react"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "sip_deposit",
      title: "SIP Deposit Executed",
      description: "Weekly USDC deposit of $500",
      amount: "+$500.00",
      time: "2 minutes ago",
      icon: TrendingUp,
      iconColor: "text-green-500",
      badge: "SIP",
      badgeVariant: "default" as const,
    },
    {
      id: 2,
      type: "yield_earned",
      title: "Yield Harvested",
      description: "From Somnia Liquidity Pool",
      amount: "+$47.23",
      time: "1 hour ago",
      icon: Zap,
      iconColor: "text-yellow-500",
      badge: "Yield",
      badgeVariant: "secondary" as const,
    },
    {
      id: 3,
      type: "rebalance",
      title: "Portfolio Rebalanced",
      description: "Optimized for 12.5% APY",
      amount: "Optimized",
      time: "3 hours ago",
      icon: ArrowUpRight,
      iconColor: "text-blue-500",
      badge: "Auto",
      badgeVariant: "outline" as const,
    },
    {
      id: 4,
      type: "emergency_lock",
      title: "Emergency Fund Locked",
      description: "Locked $5,000 for 30 days",
      amount: "$5,000.00",
      time: "1 day ago",
      icon: Lock,
      iconColor: "text-purple-500",
      badge: "Security",
      badgeVariant: "destructive" as const,
    },
    {
      id: 5,
      type: "sip_created",
      title: "New SIP Created",
      description: "Monthly ETH investment plan",
      amount: "$1,000/mo",
      time: "2 days ago",
      icon: TrendingUp,
      iconColor: "text-green-500",
      badge: "New",
      badgeVariant: "default" as const,
    },
    {
      id: 6,
      type: "withdrawal",
      title: "Early Withdrawal",
      description: "From SIP #3 with 2% penalty",
      amount: "-$980.00",
      time: "3 days ago",
      icon: ArrowDownRight,
      iconColor: "text-red-500",
      badge: "Penalty",
      badgeVariant: "destructive" as const,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest transactions and automated actions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-muted">
                  <activity.icon className={`h-5 w-5 ${activity.iconColor}`} />
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium leading-none">{activity.title}</p>
                  <Badge variant={activity.badgeVariant} className="text-xs">
                    {activity.badge}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{activity.description}</p>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium">{activity.amount}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
