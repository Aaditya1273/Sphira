import { type NextRequest, NextResponse } from "next/server"

// Mock analytics data
const mockAnalytics = {
  overview: {
    totalUsers: 1247,
    totalValueLocked: 15678234.56,
    totalSIPs: 3456,
    totalYieldGenerated: 987654.32,
    averageAPY: 11.8,
  },
  sipMetrics: {
    totalSIPs: 3456,
    activeSIPs: 2890,
    pausedSIPs: 456,
    completedSIPs: 110,
    averageAmount: 750.25,
    popularTokens: [
      { token: "USDC", count: 1234, percentage: 35.7 },
      { token: "ETH", count: 987, percentage: 28.5 },
      { token: "SOM", count: 765, percentage: 22.1 },
      { token: "BTC", count: 470, percentage: 13.6 },
    ],
    frequencyDistribution: [
      { frequency: "weekly", count: 1456, percentage: 42.1 },
      { frequency: "monthly", count: 1234, percentage: 35.7 },
      { frequency: "biweekly", count: 567, percentage: 16.4 },
      { frequency: "daily", count: 199, percentage: 5.8 },
    ],
  },
  yieldMetrics: {
    totalPools: 12,
    activePools: 10,
    averageAPY: 11.8,
    totalTVL: 45678901.23,
    topPools: [
      { name: "Somnia LP", apy: 12.5, tvl: 2400000 },
      { name: "ETH Staking", apy: 15.2, tvl: 1800000 },
      { name: "USDC Vault", apy: 8.7, tvl: 8100000 },
    ],
  },
  emergencyMetrics: {
    totalLocks: 234,
    activeLocks: 189,
    totalLocked: 5678901.23,
    averageLockDuration: 45, // days
    emergencyUnlocks: 12,
    pendingProposals: 3,
  },
  timeSeriesData: {
    tvl: [
      { date: "2024-01-01", value: 12000000 },
      { date: "2024-01-02", value: 12150000 },
      { date: "2024-01-03", value: 12300000 },
      { date: "2024-01-04", value: 12450000 },
      { date: "2024-01-05", value: 12600000 },
      { date: "2024-01-06", value: 12750000 },
      { date: "2024-01-07", value: 12900000 },
    ],
    users: [
      { date: "2024-01-01", value: 1100 },
      { date: "2024-01-02", value: 1120 },
      { date: "2024-01-03", value: 1145 },
      { date: "2024-01-04", value: 1170 },
      { date: "2024-01-05", value: 1195 },
      { date: "2024-01-06", value: 1220 },
      { date: "2024-01-07", value: 1247 },
    ],
    apy: [
      { date: "2024-01-01", value: 10.5 },
      { date: "2024-01-02", value: 10.8 },
      { date: "2024-01-03", value: 11.1 },
      { date: "2024-01-04", value: 11.3 },
      { date: "2024-01-05", value: 11.5 },
      { date: "2024-01-06", value: 11.7 },
      { date: "2024-01-07", value: 11.8 },
    ],
  },
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const metric = searchParams.get("metric")
    const timeframe = searchParams.get("timeframe") || "7d"

    let data = mockAnalytics

    // Filter by specific metric
    if (metric) {
      switch (metric) {
        case "sips":
          data = { sipMetrics: mockAnalytics.sipMetrics } as any
          break
        case "yield":
          data = { yieldMetrics: mockAnalytics.yieldMetrics } as any
          break
        case "emergency":
          data = { emergencyMetrics: mockAnalytics.emergencyMetrics } as any
          break
        case "timeseries":
          data = { timeSeriesData: mockAnalytics.timeSeriesData } as any
          break
        default:
          data = { overview: mockAnalytics.overview } as any
      }
    }

    return NextResponse.json({
      success: true,
      data,
      timeframe,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch analytics" }, { status: 500 })
  }
}
