"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MoreHorizontal, Play, Pause, Square, TrendingUp, Calendar, DollarSign } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function SIPList() {
  const sips = [
    {
      id: 1,
      name: "USDC Growth Plan",
      token: "USDC",
      amount: 500,
      frequency: "Weekly",
      status: "Active",
      progress: 75,
      totalInvested: 15000,
      targetAmount: 20000,
      nextExecution: "2024-01-15",
      apy: 8.5,
    },
    {
      id: 2,
      name: "ETH Accumulation",
      token: "ETH",
      amount: 0.5,
      frequency: "Bi-weekly",
      status: "Active",
      progress: 60,
      totalInvested: 12000,
      targetAmount: 20000,
      nextExecution: "2024-01-18",
      apy: 12.3,
    },
    {
      id: 3,
      name: "SOM Token SIP",
      token: "SOM",
      amount: 1000,
      frequency: "Monthly",
      status: "Paused",
      progress: 40,
      totalInvested: 8000,
      targetAmount: 20000,
      nextExecution: "2024-02-01",
      apy: 15.7,
    },
    {
      id: 4,
      name: "Conservative USDC",
      token: "USDC",
      amount: 200,
      frequency: "Daily",
      status: "Active",
      progress: 90,
      totalInvested: 18000,
      targetAmount: 20000,
      nextExecution: "2024-01-14",
      apy: 6.2,
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "default"
      case "Paused":
        return "secondary"
      case "Completed":
        return "outline"
      default:
        return "secondary"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <Play className="h-3 w-3" />
      case "Paused":
        return <Pause className="h-3 w-3" />
      case "Completed":
        return <Square className="h-3 w-3" />
      default:
        return <Pause className="h-3 w-3" />
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {sips.map((sip) => (
        <Card key={sip.id} className="relative">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CardTitle className="text-lg">{sip.name}</CardTitle>
                <Badge variant={getStatusColor(sip.status)} className="text-xs">
                  {getStatusIcon(sip.status)}
                  <span className="ml-1">{sip.status}</span>
                </Badge>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>Edit SIP</DropdownMenuItem>
                  <DropdownMenuItem>Pause SIP</DropdownMenuItem>
                  <DropdownMenuItem>View History</DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">Cancel SIP</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <CardDescription>
              {sip.amount} {sip.token} • {sip.frequency} • {sip.apy}% APY
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">
                  ${sip.totalInvested.toLocaleString()} / ${sip.targetAmount.toLocaleString()}
                </span>
              </div>
              <Progress value={sip.progress} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <DollarSign className="h-3 w-3" />
                  <span>Total Invested</span>
                </div>
                <p className="font-semibold">${sip.totalInvested.toLocaleString()}</p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <TrendingUp className="h-3 w-3" />
                  <span>Current APY</span>
                </div>
                <p className="font-semibold text-primary">{sip.apy}%</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>Next: {sip.nextExecution}</span>
              </div>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
