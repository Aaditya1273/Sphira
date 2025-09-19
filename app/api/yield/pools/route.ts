import { type NextRequest, NextResponse } from "next/server"

// Mock yield pools data
const mockPools = [
  {
    id: 1,
    name: "Somnia Liquidity Pool",
    protocol: "SomniaSwap",
    token: "SOM-USDC",
    apy: 12.5,
    tvl: 2400000,
    capacity: 85,
    riskScore: 2,
    riskLevel: "Low",
    verified: true,
    tokens: ["SOM", "USDC"],
    contractAddress: "0x1234567890123456789012345678901234567890",
  },
  {
    id: 2,
    name: "USDC Yield Vault",
    protocol: "SomniaLend",
    token: "USDC",
    apy: 8.7,
    tvl: 8100000,
    capacity: 60,
    riskScore: 1,
    riskLevel: "Low",
    verified: true,
    tokens: ["USDC"],
    contractAddress: "0x2345678901234567890123456789012345678901",
  },
  {
    id: 3,
    name: "ETH Staking Pool",
    protocol: "SomniaStake",
    token: "ETH",
    apy: 15.2,
    tvl: 1800000,
    capacity: 90,
    riskScore: 4,
    riskLevel: "Medium",
    verified: true,
    tokens: ["ETH"],
    contractAddress: "0x3456789012345678901234567890123456789012",
  },
  {
    id: 4,
    name: "High Yield DeFi",
    protocol: "YieldMax",
    token: "Various",
    apy: 24.8,
    tvl: 450000,
    capacity: 95,
    riskScore: 8,
    riskLevel: "High",
    verified: false,
    tokens: ["Various"],
    contractAddress: "0x4567890123456789012345678901234567890123",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get("token")
    const maxRisk = searchParams.get("maxRisk")
    const sortBy = searchParams.get("sortBy") || "apy"

    let filteredPools = [...mockPools]

    // Filter by token
    if (token) {
      filteredPools = filteredPools.filter((pool) => pool.tokens.includes(token.toUpperCase()))
    }

    // Filter by risk level
    if (maxRisk) {
      const maxRiskScore = Number.parseInt(maxRisk)
      filteredPools = filteredPools.filter((pool) => pool.riskScore <= maxRiskScore)
    }

    // Sort pools
    filteredPools.sort((a, b) => {
      switch (sortBy) {
        case "apy":
          return b.apy - a.apy
        case "tvl":
          return b.tvl - a.tvl
        case "risk":
          return a.riskScore - b.riskScore
        default:
          return b.apy - a.apy
      }
    })

    return NextResponse.json({
      success: true,
      data: filteredPools,
      total: filteredPools.length,
    })
  } catch (error) {
    console.error("Error fetching yield pools:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch yield pools" }, { status: 500 })
  }
}
