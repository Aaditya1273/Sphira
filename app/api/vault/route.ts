import { type NextRequest, NextResponse } from "next/server"
import { blockchainService } from "@/lib/blockchain-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userAddress = searchParams.get("userAddress")

    if (!userAddress) {
      return NextResponse.json({ success: false, error: "User address required" }, { status: 400 })
    }

    // Get real vault data from blockchain
    const locks = await blockchainService.getUserLocks(userAddress)
    
    // Calculate total locked value
    const totalLocked = locks.reduce((sum, lock) => sum + parseFloat(lock.amount), 0)

    const vaultData = {
      totalLocked,
      locks: locks.map(lock => ({
        id: lock.id,
        token: lock.token === process.env.NEXT_PUBLIC_USDC_ADDRESS ? 'USDC' : 
               lock.token === process.env.NEXT_PUBLIC_ETH_ADDRESS ? 'ETH' : 'SOM',
        amount: lock.amount,
        unlockTime: lock.unlockTime,
        status: lock.status
      })),
      governance: {
        requiredSignatures: 3,
        totalSigners: 5,
        emergencyProtocol: "Active",
        governanceDelay: "48 hours"
      }
    }

    return NextResponse.json({
      success: true,
      data: vaultData,
    })
  } catch (error) {
    console.error("Error fetching vault data:", error)
    
    // Return empty vault if blockchain fails
    return NextResponse.json({
      success: true,
      data: {
        totalLocked: 0,
        locks: [],
        governance: {
          requiredSignatures: 3,
          totalSigners: 5,
          emergencyProtocol: "Active",
          governanceDelay: "48 hours"
        }
      },
    })
  }
}