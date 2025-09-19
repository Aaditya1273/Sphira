import { type NextRequest, NextResponse } from "next/server"

// Mock portfolio data
const mockPortfolio = {
  totalValue: 124567.89,
  totalInvested: 98000.0,
  totalYield: 26567.89,
  yieldPercentage: 27.1,
  activeSIPs: 8,
  emergencyFunds: 25000.0,
  allocations: [
    {
      token: "USDC",
      amount: 45000.0,
      percentage: 36.1,
      apy: 8.5,
      yieldEarned: 3825.0,
    },
    {
      token: "ETH",
      amount: 35000.0,
      percentage: 28.1,
      apy: 12.3,
      yieldEarned: 4305.0,
    },
    {
      token: "SOM",
      amount: 30000.0,
      percentage: 24.1,
      apy: 15.7,
      yieldEarned: 4710.0,
    },
    {
      token: "BTC",
      amount: 14567.89,
      percentage: 11.7,
      apy: 6.2,
      yieldEarned: 903.21,
    },
  ],
  recentActivity: [
    {
      id: 1,
      type: "sip_deposit",
      description: "Weekly USDC deposit",
      amount: 500.0,
      timestamp: "2024-01-14T08:00:00Z",
    },
    {
      id: 2,
      type: "yield_harvest",
      description: "Yield harvested from Somnia LP",
      amount: 47.23,
      timestamp: "2024-01-14T07:00:00Z",
    },
    {
      id: 3,
      type: "rebalance",
      description: "Portfolio auto-rebalanced",
      amount: 0,
      timestamp: "2024-01-14T06:00:00Z",
    },
  ],
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "user1"

    // In production, fetch user-specific portfolio data from database
    return NextResponse.json({
      success: true,
      data: mockPortfolio,
    })
  } catch (error) {
    console.error("Error fetching portfolio:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch portfolio" }, { status: 500 })
  }
}
