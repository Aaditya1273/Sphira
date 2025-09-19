import { type NextRequest, NextResponse } from "next/server"
import { blockchainService } from "@/lib/blockchain-service"

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


