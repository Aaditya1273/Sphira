"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Shield, AlertCircle, ExternalLink } from "lucide-react"

export function YieldPools() {
  const pools = [
    {
      name: "Somnia Liquidity Pool",
      protocol: "SomniaSwap",
      apy: 12.5,
      tvl: "$2.4M",
      capacity: 85,
      risk: "Low",
      riskScore: 2,
      allocation: 45,
      tokens: ["SOM", "USDC"],
      verified: true,
    },
    {
      name: "USDC Yield Vault",
      protocol: "SomniaLend",
      apy: 8.7,
      tvl: "$8.1M",
      capacity: 60,
      risk: "Low",
      riskScore: 1,
      allocation: 30,
      tokens: ["USDC"],
      verified: true,
    },
    {
      name: "ETH Staking Pool",
      protocol: "SomniaStake",
      apy: 15.2,
      tvl: "$1.8M",
      capacity: 90,
      risk: "Medium",
      riskScore: 4,
      allocation: 20,
      tokens: ["ETH"],
      verified: true,
    },
    {
      name: "High Yield DeFi",
      protocol: "YieldMax",
      apy: 24.8,
      tvl: "$450K",
      capacity: 95,
      risk: "High",
      riskScore: 8,
      allocation: 5,
      tokens: ["Various"],
      verified: false,
    },
  ]

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-green-500 bg-green-500/10"
      case "Medium":
        return "text-yellow-500 bg-yellow-500/10"
      case "High":
        return "text-red-500 bg-red-500/10"
      default:
        return "text-gray-500 bg-gray-500/10"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Available Yield Pools</CardTitle>
        <CardDescription>Discover and analyze yield opportunities on Somnia</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {pools.map((pool, index) => (
          <div key={index} className="border rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold">{pool.name}</h4>
                  {pool.verified && <Shield className="h-4 w-4 text-green-500" />}
                  {!pool.verified && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                </div>
                <p className="text-sm text-muted-foreground">{pool.protocol}</p>
                <div className="flex items-center gap-2">
                  {pool.tokens.map((token) => (
                    <Badge key={token} variant="outline" className="text-xs">
                      {token}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-right space-y-1">
                <div className="text-lg font-bold text-primary">{pool.apy}%</div>
                <div className="text-xs text-muted-foreground">APY</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="text-muted-foreground">TVL</div>
                <div className="font-medium">{pool.tvl}</div>
              </div>
              <div>
                <div className="text-muted-foreground">Risk Score</div>
                <div className="flex items-center gap-2">
                  <Badge className={getRiskColor(pool.risk)}>{pool.risk}</Badge>
                  <span className="text-xs">({pool.riskScore}/10)</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Capacity</span>
                <span>{pool.capacity}%</span>
              </div>
              <Progress value={pool.capacity} className="h-1" />
            </div>

            {pool.allocation > 0 && (
              <div className="bg-primary/5 rounded-lg p-2">
                <div className="flex items-center gap-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="text-primary font-medium">{pool.allocation}% of your portfolio allocated</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <Button variant="outline" size="sm">
                <ExternalLink className="h-3 w-3 mr-1" />
                View Pool
              </Button>
              <Button size="sm" disabled={pool.allocation > 0}>
                {pool.allocation > 0 ? "Allocated" : "Add to Portfolio"}
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
