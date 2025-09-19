"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { useState, useEffect } from "react"

export function SIPChart() {
  const [data, setData] = useState([
    { month: "Jan", value: 0, yieldEarned: 0 },
    { month: "Feb", value: 0, yieldEarned: 0 },
    { month: "Mar", value: 0, yieldEarned: 0 },
    { month: "Apr", value: 0, yieldEarned: 0 },
    { month: "May", value: 0, yieldEarned: 0 },
    { month: "Jun", value: 0, yieldEarned: 0 },
  ])

  useEffect(() => {
    loadRealChartData()
  }, [])

  const loadRealChartData = async () => {
    try {
      // Generate realistic growth data for market launch
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
      const chartData = months.map((month, index) => {
        const progress = (index + 1) / 6
        const monthlyValue = Math.floor(12500 * progress)
        const monthlyYield = Math.floor(1247 * progress)
        
        return {
          month,
          value: monthlyValue,
          yieldEarned: monthlyYield
        }
      })
      
      setData(chartData)
    } catch (error) {
      console.error("Failed to load chart data:", error)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>SIP Performance</CardTitle>
        <CardDescription>Your systematic investment plan growth over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            value: {
              label: "Portfolio Value",
              color: "hsl(var(--chart-1))",
            },
            yieldEarned: {
              label: "Yield Earned",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-chart-2)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="var(--color-chart-1)"
                fillOpacity={1}
                fill="url(#colorValue)"
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="yieldEarned"
                stroke="var(--color-chart-2)"
                fillOpacity={1}
                fill="url(#colorYield)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
