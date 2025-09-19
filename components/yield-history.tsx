"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  { date: "Jan 1", apy: 8.2, earned: 120 },
  { date: "Jan 8", apy: 8.7, earned: 145 },
  { date: "Jan 15", apy: 9.1, earned: 168 },
  { date: "Jan 22", apy: 8.9, earned: 192 },
  { date: "Jan 29", apy: 9.4, earned: 218 },
  { date: "Feb 5", apy: 10.1, earned: 247 },
  { date: "Feb 12", apy: 9.8, earned: 275 },
  { date: "Feb 19", apy: 10.5, earned: 306 },
  { date: "Feb 26", apy: 11.2, earned: 340 },
  { date: "Mar 5", apy: 10.9, earned: 373 },
  { date: "Mar 12", apy: 11.7, earned: 410 },
  { date: "Mar 19", apy: 12.3, earned: 450 },
]

export function YieldHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Yield Performance History</CardTitle>
        <CardDescription>Track your yield optimization performance over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            apy: {
              label: "APY %",
              color: "hsl(var(--chart-1))",
            },
            earned: {
              label: "Yield Earned ($)",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" axisLine={false} tickLine={false} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="apy"
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                dot={{ fill: "var(--color-chart-1)", strokeWidth: 2, r: 4 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="earned"
                stroke="var(--color-chart-2)"
                strokeWidth={2}
                dot={{ fill: "var(--color-chart-2)", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
