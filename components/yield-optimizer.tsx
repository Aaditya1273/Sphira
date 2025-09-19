"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Zap, TrendingUp, Shield, AlertTriangle } from "lucide-react"

export function YieldOptimizer() {
  const pools = [
    {
      name: "Somnia Liquidity Pool",
      apy: 12.5,
      tvl: "$2.4M",
      allocation: 45,
      risk: "Low",
      riskColor: "bg-green-500",
    },
    {
      name: "USDC Yield Vault",
      apy: 8.7,
      tvl: "$8.1M",
      allocation: 30,
      risk: "Low",
      riskColor: "bg-green-500",
    },
    {
      name: "ETH Staking Pool",
      apy: 15.2,
      tvl: "$1.8M",
      allocation: 20,
      risk: "Medium",
      riskColor: "bg-yellow-500",
    },
    {
      name: "High Yield DeFi",
      apy: 24.8,
      tvl: "$450K",
      allocation: 5,
      risk: "High",
      riskColor: "bg-red-500",
    },
  ]

  const totalAPY = pools.reduce((acc, pool) => acc + (pool.apy * pool.allocation) / 100, 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Yield Optimizer
            </CardTitle>
            <CardDescription>Automated yield routing across Somnia DeFi pools</CardDescription>
          </div>
          <Badge variant="outline" className="text-lg font-semibold">
            {totalAPY.toFixed(1)}% APY
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {pools.map((pool) => (
            <div key={pool.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${pool.riskColor}`} />
                  <span className="font-medium">{pool.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {pool.risk}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">{pool.tvl}</span>
                  <span className="font-semibold text-primary">{pool.apy}%</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={pool.allocation} className="flex-1" />
                <span className="text-xs text-muted-foreground w-8">{pool.allocation}%</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span>Auto-rebalancing enabled</span>
          </div>
          <Button size="sm" variant="outline">
            <Shield className="h-4 w-4 mr-2" />
            Adjust Risk
          </Button>
        </div>

        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5" />
            <div className="text-xs">
              <p className="font-medium">Optimization Suggestion</p>
              <p className="text-muted-foreground">Consider rebalancing to Somnia LP for +2.3% APY improvement</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
