"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { month: "Jan", value: 5000, yield: 150 },
  { month: "Feb", value: 10200, yield: 320 },
  { month: "Mar", value: 15800, yield: 510 },
  { month: "Apr", value: 21500, yield: 720 },
  { month: "May", value: 27800, yield: 950 },
  { month: "Jun", value: 34200, yield: 1200 },
  { month: "Jul", value: 41000, yield: 1480 },
  { month: "Aug", value: 48500, yield: 1790 },
  { month: "Sep", value: 56200, yield: 2130 },
  { month: "Oct", value: 64800, yield: 2500 },
  { month: "Nov", value: 73500, yield: 2890 },
  { month: "Dec", value: 82900, yield: 3320 },
]

export function SIPChart() {
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
            yield: {
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
                dataKey="yield"
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
