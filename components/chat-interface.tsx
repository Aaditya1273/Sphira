"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Zap, TrendingUp, Lock, Wallet, HelpCircle, X } from "lucide-react"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
  command?: string
  data?: any
}

interface ChatInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatInterface({ isOpen, onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content:
        "Welcome to Sphira! I can help you manage your SIPs, check portfolio, and more. Try commands like `/startSIP`, `/portfolio`, or `/help`.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const commands = [
    { command: "/startSIP", description: "Create a new SIP", example: "/startSIP 100 USDC weekly" },
    { command: "/portfolio", description: "View portfolio summary", example: "/portfolio" },
    { command: "/yield", description: "Check yield optimization", example: "/yield" },
    { command: "/lockFunds", description: "Lock emergency funds", example: "/lockFunds 5000 USDC 30days" },
    { command: "/balance", description: "Check wallet balance", example: "/balance" },
    { command: "/history", description: "View transaction history", example: "/history" },
    { command: "/help", description: "Show available commands", example: "/help" },
  ]

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate bot response
    setTimeout(() => {
      const botResponse = processCommand(input)
      setMessages((prev) => [...prev, botResponse])
      setIsTyping(false)
    }, 1000)
  }

  const processCommand = (input: string): Message => {
    const command = input.toLowerCase().trim()

    if (command.startsWith("/startsip")) {
      const parts = command.split(" ")
      if (parts.length >= 4) {
        const [, amount, token, frequency] = parts
        return {
          id: Date.now().toString(),
          type: "bot",
          content: `Creating SIP: ${amount} ${token.toUpperCase()} ${frequency}. Please confirm the transaction in your wallet.`,
          timestamp: new Date(),
          command: "startSIP",
          data: { amount, token, frequency },
        }
      }
      return {
        id: Date.now().toString(),
        type: "bot",
        content: "Usage: /startSIP <amount> <token> <frequency>\nExample: /startSIP 100 USDC weekly",
        timestamp: new Date(),
      }
    }

    if (command === "/portfolio") {
      return {
        id: Date.now().toString(),
        type: "bot",
        content:
          "📊 Portfolio Summary:\n• Total Value: $124,567.89\n• Active SIPs: 8\n• Yield Earned: $3,247.12\n• Emergency Funds: $25,000.00",
        timestamp: new Date(),
        command: "portfolio",
      }
    }

    if (command === "/yield") {
      return {
        id: Date.now().toString(),
        type: "bot",
        content:
          "⚡ Yield Optimization:\n• Current APY: 11.2%\n• Best Pool: Somnia LP (12.5%)\n• Suggestion: Rebalance for +2.3% improvement",
        timestamp: new Date(),
        command: "yield",
      }
    }

    if (command.startsWith("/lockfunds")) {
      const parts = command.split(" ")
      if (parts.length >= 4) {
        const [, amount, token, duration] = parts
        return {
          id: Date.now().toString(),
          type: "bot",
          content: `Locking ${amount} ${token.toUpperCase()} for ${duration}. This will secure your funds in the emergency vault. Confirm transaction?`,
          timestamp: new Date(),
          command: "lockFunds",
          data: { amount, token, duration },
        }
      }
      return {
        id: Date.now().toString(),
        type: "bot",
        content: "Usage: /lockFunds <amount> <token> <duration>\nExample: /lockFunds 5000 USDC 30days",
        timestamp: new Date(),
      }
    }

    if (command === "/balance") {
      return {
        id: Date.now().toString(),
        type: "bot",
        content: "💰 Wallet Balance:\n• USDC: 15,420.50\n• ETH: 8.75\n• SOM: 25,000.00\n• Total USD: $89,234.12",
        timestamp: new Date(),
        command: "balance",
      }
    }

    if (command === "/history") {
      return {
        id: Date.now().toString(),
        type: "bot",
        content:
          "📈 Recent Transactions:\n• SIP Deposit: +$500 USDC (2 min ago)\n• Yield Harvest: +$47.23 (1 hour ago)\n• Portfolio Rebalance (3 hours ago)",
        timestamp: new Date(),
        command: "history",
      }
    }

    if (command === "/help") {
      const helpText = commands
        .map((cmd) => `${cmd.command} - ${cmd.description}\nExample: ${cmd.example}`)
        .join("\n\n")
      return {
        id: Date.now().toString(),
        type: "bot",
        content: `Available Commands:\n\n${helpText}`,
        timestamp: new Date(),
        command: "help",
      }
    }

    // Default response for unrecognized commands
    return {
      id: Date.now().toString(),
      type: "bot",
      content: "I didn't understand that command. Type /help to see available commands.",
      timestamp: new Date(),
    }
  }

  const getCommandIcon = (command?: string) => {
    switch (command) {
      case "startSIP":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "yield":
        return <Zap className="h-4 w-4 text-yellow-500" />
      case "lockFunds":
        return <Lock className="h-4 w-4 text-purple-500" />
      case "balance":
        return <Wallet className="h-4 w-4 text-blue-500" />
      case "help":
        return <HelpCircle className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:relative lg:bg-transparent lg:backdrop-blur-none">
      <div className="fixed right-0 top-0 h-full w-full bg-background lg:relative lg:w-96">
        <Card className="h-full rounded-none lg:rounded-lg">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">Sphira Assistant</CardTitle>
                  <p className="text-xs text-muted-foreground">AI-powered DeFi helper</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex flex-col h-[calc(100%-5rem)] p-0">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start space-x-2 ${
                      message.type === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {message.type === "bot" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-muted">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg p-3 ${
                        message.type === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        {getCommandIcon(message.command)}
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <p className="text-xs opacity-70">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                    {message.type === "user" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="flex items-start space-x-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-muted">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-muted rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="border-t p-4">
              <div className="flex space-x-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a command or message..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {commands.slice(0, 4).map((cmd) => (
                  <Badge
                    key={cmd.command}
                    variant="outline"
                    className="text-xs cursor-pointer hover:bg-muted"
                    onClick={() => setInput(cmd.example)}
                  >
                    {cmd.command}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
