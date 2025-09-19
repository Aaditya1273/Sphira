import { type NextRequest, NextResponse } from "next/server"

// Mock SIP data
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
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sipId = Number.parseInt(params.id)
    const sip = mockSIPs.find((s) => s.id === sipId)

    if (!sip) {
      return NextResponse.json({ success: false, error: "SIP not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: sip,
    })
  } catch (error) {
    console.error("Error fetching SIP:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch SIP" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sipId = Number.parseInt(params.id)
    const body = await request.json()
    const { status, amount, frequency } = body

    const sipIndex = mockSIPs.findIndex((s) => s.id === sipId)
    if (sipIndex === -1) {
      return NextResponse.json({ success: false, error: "SIP not found" }, { status: 404 })
    }

    // Update SIP
    if (status) mockSIPs[sipIndex].status = status
    if (amount) mockSIPs[sipIndex].amount = Number.parseFloat(amount)
    if (frequency) mockSIPs[sipIndex].frequency = frequency

    return NextResponse.json({
      success: true,
      data: mockSIPs[sipIndex],
      message: "SIP updated successfully",
    })
  } catch (error) {
    console.error("Error updating SIP:", error)
    return NextResponse.json({ success: false, error: "Failed to update SIP" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sipId = Number.parseInt(params.id)
    const sipIndex = mockSIPs.findIndex((s) => s.id === sipId)

    if (sipIndex === -1) {
      return NextResponse.json({ success: false, error: "SIP not found" }, { status: 404 })
    }

    // Remove SIP
    mockSIPs.splice(sipIndex, 1)

    return NextResponse.json({
      success: true,
      message: "SIP deleted successfully",
    })
  } catch (error) {
    console.error("Error deleting SIP:", error)
    return NextResponse.json({ success: false, error: "Failed to delete SIP" }, { status: 500 })
  }
}
