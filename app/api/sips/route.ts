import { type NextRequest, NextResponse } from "next/server"
import { blockchainService } from "@/lib/blockchain-service"

// Generate initial performance data when SIP is created
async function generateInitialPerformanceData(userAddress: string, sip: any) {
  try {
    // Get existing yield history
    const allYieldHistory = JSON.parse((global as any).tempYieldStorage || '[]')
    
    // Generate initial data points (simulating the first few days/weeks)
    const initialDataPoints = []
    const startDate = new Date()
    
    // Create 5 initial data points showing gradual growth
    for (let i = 0; i < 5; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() - (4 - i) * 7) // Weekly intervals going back
      
      const progressFactor = (i + 1) / 5
      const baseAPY = sip.apy_target || 8.5
      const currentAPY = baseAPY * (0.7 + 0.3 * progressFactor) // Start at 70% of target, grow to 100%
      const earned = parseFloat(sip.amount) * (currentAPY / 100) * (progressFactor * 0.1) // Cumulative earnings
      
      initialDataPoints.push({
        id: allYieldHistory.length + i + 1,
        userAddress,
        apy: parseFloat(currentAPY.toFixed(2)),
        earned: parseFloat(earned.toFixed(2)),
        date: date.toISOString(),
        timestamp: date.getTime(),
        sipId: sip.id
      })
    }
    
    // Add to yield history storage
    allYieldHistory.push(...initialDataPoints)
    ;(global as any).tempYieldStorage = JSON.stringify(allYieldHistory)
    
    console.log(`✅ Generated ${initialDataPoints.length} initial performance data points for SIP ${sip.id}`)
  } catch (error) {
    console.error("Failed to generate initial performance data:", error)
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userAddress = searchParams.get("userAddress")

    if (!userAddress) {
      return NextResponse.json({ success: false, error: "User address required" }, { status: 400 })
    }

    // Get user SIPs from temporary storage (in production, this would be from blockchain)
    const allSIPs = JSON.parse((global as any).tempSIPStorage || '{}')
    const userSIPs = allSIPs[userAddress] || []

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
    const { name, token, amount, frequency, userAddress, duration, penalty = 2, reason } = body

    // Validate required fields
    if (!name || !token || !amount || !frequency || !userAddress) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // For now, create a mock SIP entry (in production, this would interact with blockchain)
    const newSIP = {
      id: Math.floor(Math.random() * 10000),
      name: name,
      token_symbol: token.toUpperCase(),
      amount: parseFloat(amount),
      frequency: frequency,
      duration: duration ? parseInt(duration) : null,
      penalty: parseFloat(penalty),
      reason: reason || "",
      user_address: userAddress,
      status: "Active",
      total_deposits: 0,
      execution_count: 0,
      apy_target: 8.5, // Mock APY
      next_execution: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      created_at: new Date().toISOString()
    }

    // Store in temporary storage (in production, this would be blockchain + database)
    const existingSIPs = JSON.parse((global as any).tempSIPStorage || '{}')
    if (!existingSIPs[userAddress]) {
      existingSIPs[userAddress] = []
    }
    existingSIPs[userAddress].push(newSIP)
    ;(global as any).tempSIPStorage = JSON.stringify(existingSIPs)

    // Generate initial performance data for the charts
    await generateInitialPerformanceData(userAddress, newSIP)

    return NextResponse.json({
      success: true,
      data: newSIP,
      message: "SIP created successfully!",
    })
  } catch (error) {
    console.error("Error creating SIP:", error)
    return NextResponse.json({ success: false, error: "Failed to create SIP" }, { status: 500 })
  }
}


