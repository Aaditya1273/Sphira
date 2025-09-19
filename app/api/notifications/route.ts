import { type NextRequest, NextResponse } from "next/server"

// Mock notifications data
const mockNotifications = [
  {
    id: 1,
    type: "sip_execution",
    title: "SIP Executed Successfully",
    message: "Your weekly USDC SIP of $500 has been executed",
    timestamp: "2024-01-14T08:00:00Z",
    read: false,
    priority: "normal",
    data: {
      sipId: 1,
      amount: 500,
      token: "USDC",
    },
  },
  {
    id: 2,
    type: "yield_opportunity",
    title: "New Yield Opportunity",
    message: "Somnia LP offering 12.5% APY - Consider rebalancing",
    timestamp: "2024-01-14T07:30:00Z",
    read: false,
    priority: "high",
    data: {
      poolId: 1,
      apy: 12.5,
    },
  },
  {
    id: 3,
    type: "security_alert",
    title: "Emergency Fund Unlock Request",
    message: "Emergency proposal #5 requires your vote",
    timestamp: "2024-01-14T06:00:00Z",
    read: true,
    priority: "urgent",
    data: {
      proposalId: 5,
      lockId: 3,
    },
  },
  {
    id: 4,
    type: "portfolio_update",
    title: "Portfolio Rebalanced",
    message: "Your portfolio has been optimized for better yield",
    timestamp: "2024-01-14T05:00:00Z",
    read: true,
    priority: "normal",
    data: {
      oldAPY: 10.8,
      newAPY: 11.2,
    },
  },
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId") || "user1"
    const unreadOnly = searchParams.get("unreadOnly") === "true"
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    let notifications = [...mockNotifications]

    // Filter unread only
    if (unreadOnly) {
      notifications = notifications.filter((n) => !n.read)
    }

    // Limit results
    notifications = notifications.slice(0, limit)

    return NextResponse.json({
      success: true,
      data: notifications,
      total: notifications.length,
      unreadCount: mockNotifications.filter((n) => !n.read).length,
    })
  } catch (error) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json({ success: false, error: "Failed to fetch notifications" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, title, message, priority = "normal", data, userId = "user1" } = body

    const newNotification = {
      id: mockNotifications.length + 1,
      type,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      priority,
      data,
      userId,
    }

    mockNotifications.unshift(newNotification)

    // In production, you would:
    // 1. Save to database
    // 2. Send push notification
    // 3. Send email if configured
    // 4. Update WebSocket connections

    return NextResponse.json({
      success: true,
      data: newNotification,
      message: "Notification created successfully",
    })
  } catch (error) {
    console.error("Error creating notification:", error)
    return NextResponse.json({ success: false, error: "Failed to create notification" }, { status: 500 })
  }
}
