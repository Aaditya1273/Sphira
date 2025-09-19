import { type NextRequest, NextResponse } from "next/server"

interface ChatMessage {
  message: string
  userId?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatMessage = await request.json()
    const { message, userId = "user1" } = body

    // Process chat command
    const response = await processChatCommand(message, userId)

    return NextResponse.json({
      success: true,
      data: {
        response,
        timestamp: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("Error processing chat message:", error)
    return NextResponse.json({ success: false, error: "Failed to process message" }, { status: 500 })
  }
}

async function processChatCommand(message: string, userId: string): Promise<string> {
  const command = message.toLowerCase().trim()

  if (command.startsWith("/startsip")) {
    const parts = command.split(" ")
    if (parts.length >= 4) {
      const [, amount, token, frequency] = parts
      // In production, create SIP via smart contract
      return `Creating SIP: ${amount} ${token.toUpperCase()} ${frequency}. Please confirm the transaction in your wallet.`
    }
    return "Usage: /startSIP <amount> <token> <frequency>\nExample: /startSIP 100 USDC weekly"
  }

  if (command === "/portfolio") {
    // In production, fetch real portfolio data
    return "📊 Portfolio Summary:\n• Total Value: $124,567.89\n• Active SIPs: 8\n• Yield Earned: $3,247.12\n• Emergency Funds: $25,000.00"
  }

  if (command === "/yield") {
    return "⚡ Yield Optimization:\n• Current APY: 11.2%\n• Best Pool: Somnia LP (12.5%)\n• Suggestion: Rebalance for +2.3% improvement"
  }

  if (command.startsWith("/lockfunds")) {
    const parts = command.split(" ")
    if (parts.length >= 4) {
      const [, amount, token, duration] = parts
      return `Locking ${amount} ${token.toUpperCase()} for ${duration}. This will secure your funds in the emergency vault. Confirm transaction?`
    }
    return "Usage: /lockFunds <amount> <token> <duration>\nExample: /lockFunds 5000 USDC 30days"
  }

  if (command === "/balance") {
    return "💰 Wallet Balance:\n• USDC: 15,420.50\n• ETH: 8.75\n• SOM: 25,000.00\n• Total USD: $89,234.12"
  }

  if (command === "/history") {
    return "📈 Recent Transactions:\n• SIP Deposit: +$500 USDC (2 min ago)\n• Yield Harvest: +$47.23 (1 hour ago)\n• Portfolio Rebalance (3 hours ago)"
  }

  if (command === "/help") {
    return `Available Commands:

/startSIP - Create a new SIP
Example: /startSIP 100 USDC weekly

/portfolio - View portfolio summary
Example: /portfolio

/yield - Check yield optimization
Example: /yield

/lockFunds - Lock emergency funds
Example: /lockFunds 5000 USDC 30days

/balance - Check wallet balance
Example: /balance

/history - View transaction history
Example: /history

/help - Show available commands
Example: /help`
  }

  // Default response for unrecognized commands
  return "I didn't understand that command. Type /help to see available commands."
}
