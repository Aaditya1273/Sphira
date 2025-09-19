import { type NextRequest, NextResponse } from "next/server"

// Mock database - in production, use a real database
const mockSIPs = [
  {
    id: 1,
    userId: "user1",
    name: "USDC Growth Plan",
    token: "USDC",
    amount: 500,
    frequency: "weekly",
    status: "active",
    totalInvested: 15000,
    targetAmount: 20000,
    nextExecution: "2024-01-15T10:00:00Z",
    apy: 8.5,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    userId: "user1",
    name: "ETH Accumulation",
    token: "ETH",
    amount: 0.5,
    frequency: "biweekly",
    status: "active",
    totalInvested: 12000,
    targetAmount: 20000,
    nextExecution: "2024-01-18T10:00:00Z",
    apy: 12.3,
    createdAt: "2024-01-01T00:00:00Z",
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "user1"

    // Filter SIPs by user
    const userSIPs = mockSIPs.filter((sip) => sip.userId === userId)

    return NextResponse.json({
      success: true,
      data: userSIPs,
      total: userSIPs.length,
    })
  } catch (error) {
    console.error("Error fetching SIPs:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch SIPs" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, token, amount, frequency, duration, penalty, reason, userId = "user1" } = body

    // Validate required fields
    if (!name || !token || !amount || !frequency) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Create new SIP
    const newSIP = {
      id: mockSIPs.length + 1,
      userId,
      name,
      token,
      amount: Number.parseFloat(amount),
      frequency,
      status: "active",
      totalInvested: 0,
      targetAmount: Number.parseFloat(amount) * (duration || 12),
      nextExecution: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      apy: 8.5, // Default APY
      penalty: Number.parseFloat(penalty) || 2,
      reason,
      createdAt: new Date().toISOString(),
    }

    mockSIPs.push(newSIP)

    // In production, you would:
    // 1. Save to database
    // 2. Interact with smart contract
    // 3. Send notification

    return NextResponse.json({
      success: true,
      data: newSIP,
      message: "SIP created successfully",
    })
  } catch (error) {
    console.error("Error creating SIP:", error)
    return NextResponse.json({ success: false, error: "Failed to create SIP" }, { status: 500 })
  }
}
