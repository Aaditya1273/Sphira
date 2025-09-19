"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, DollarSign, Zap, Lock } from "lucide-react"
import { useState, useEffect } from "react"
import { tempDB } from "@/lib/temp-db-executor"

type ChangeType = "positive" | "negative" | "neutral"

export function OverviewCards() {
  const [stats, setStats] = useState([
    {
      title: "Total Portfolio Value",
      value: "$0.00",
      change: "+0%",
      changeType: "neutral" as ChangeType,
      icon: DollarSign,
      description: "Across all SIPs and yield pools",
    },
    {
      title: "Active SIPs",
      value: "0",
      change: "Connect wallet",
      changeType: "neutral" as ChangeType,
      icon: TrendingUp,
      description: "Automated investment plans",
    },
    {
      title: "Yield Earned",
      value: "$0.00",
      change: "+0%",
      changeType: "neutral" as ChangeType,
      icon: Zap,
      description: "Total yield from optimization",
    },
    {
      title: "Emergency Funds",
      value: "$0.00",
      change: "Not locked",
      changeType: "neutral" as ChangeType,
      icon: Lock,
      description: "Secured in emergency vault",
    },
  ])

  useEffect(() => {
    loadRealData()
  }, [])

  const loadRealData = async () => {
    try {
      // Get real data from database
      const data = tempDB.getAllData()
      const demoUser = data.users[0] // For demo, use first user
      
      if (demoUser) {
        const userSIPs = data.sips.filter(sip => sip.user_address === demoUser.wallet_address)
        const userYield = data.yield_history.filter(yieldRecord => yieldRecord.user_address === demoUser.wallet_address)
        const userVault = data.vault_locks.filter(vault => vault.user_address === demoUser.wallet_address)
        
        // Calculate real values
        const totalInvested = parseFloat(demoUser.stats.total_invested)
        const totalEarned = parseFloat(demoUser.stats.total_earned)
        const totalPortfolio = totalInvested + totalEarned
        const vaultBalance = parseFloat(demoUser.stats.vault_balance)
        
        setStats([
          {
            title: "Total Portfolio Value",
            value: `$${totalPortfolio.toLocaleString()}`,
            change: totalEarned > 0 ? `+${((totalEarned/totalInvested)*100).toFixed(1)}%` : "+0%",
            changeType: totalEarned > 0 ? "positive" : "neutral",
            icon: DollarSign,
            description: "Across all SIPs and yield pools",
          },
          {
            title: "Active SIPs",
            value: userSIPs.length.toString(),
            change: `${userSIPs.length} running`,
            changeType: userSIPs.length > 0 ? "positive" : "neutral",
            icon: TrendingUp,
            description: "Automated investment plans",
          },
          {
            title: "Yield Earned",
            value: `$${totalEarned.toLocaleString()}`,
            change: userYield.length > 0 ? `+${userYield.length} rewards` : "+0%",
            changeType: totalEarned > 0 ? "positive" : "neutral",
            icon: Zap,
            description: "Total yield from optimization",
          },
          {
            title: "Emergency Funds",
            value: `$${vaultBalance.toLocaleString()}`,
            change: userVault.length > 0 ? "Locked" : "Available",
            changeType: userVault.length > 0 ? "neutral" : "positive",
            icon: Lock,
            description: "Secured in emergency vault",
          },
        ])
      }
    } catch (error) {
      console.error("Failed to load real data:", error)
    }
  }

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
