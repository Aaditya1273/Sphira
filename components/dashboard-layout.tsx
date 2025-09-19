"use client"

import type React from "react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChatInterface } from "@/components/chat-interface"
import { NotificationCenter } from "@/components/notification-center"
import { ThemeToggle } from "@/components/theme-toggle"
import { BarChart3, Wallet, Shield, MessageSquare, Settings, Menu, X, TrendingUp, Lock, Zap } from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [chatOpen, setChatOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const pathname = usePathname()

  const navigation = [
    { name: "Dashboard", href: "/", icon: BarChart3 },
    { name: "My SIPs", href: "/sips", icon: TrendingUp },
    { name: "Yield Optimizer", href: "/yield", icon: Zap },
    { name: "Emergency Vault", href: "/vault", icon: Lock },
    { name: "Portfolio", href: "/portfolio", icon: Wallet },
    { name: "Security", href: "/security", icon: Shield },
    { name: "Chat Support", href: "/chat", icon: MessageSquare },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 w-64 bg-card border-r">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-lg">Sphira</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </a>
              )
            })}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:left-0 lg:block transition-all duration-300 ${
        sidebarCollapsed ? 'lg:w-16' : 'lg:w-64'
      }`}>
        <div className="flex flex-col h-full bg-card border-r">
          <div className={`flex items-center p-6 border-b transition-all duration-300 ${
            sidebarCollapsed ? 'justify-center' : 'justify-between'
          }`}>
            <button
              onClick={() => setSidebarCollapsed(false)}
              className={`flex items-center transition-all duration-300 hover:bg-muted/50 rounded-lg p-2 -m-2 ${
                sidebarCollapsed ? 'space-x-0' : 'space-x-2'
              }`}
            >
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">S</span>
              </div>
              {!sidebarCollapsed && (
                <div className="transition-opacity duration-300">
                  <span className="font-bold text-xl">Sphira</span>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    v2.0
                  </Badge>
                </div>
              )}
            </button>
            {!sidebarCollapsed && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSidebarCollapsed(true)}
                className="hover:bg-muted transition-colors"
              >
                <Menu className="h-4 w-4" />
              </Button>
            )}
          </div>

          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <a
                  key={item.name}
                  href={item.href}
                  title={sidebarCollapsed ? item.name : undefined}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    sidebarCollapsed ? 'justify-center space-x-0' : 'space-x-3'
                  } ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <item.icon className="h-4 w-4 flex-shrink-0" />
                  {!sidebarCollapsed && (
                    <span className="transition-opacity duration-300">{item.name}</span>
                  )}
                </a>
              )
            })}
          </nav>

          <div className="p-4 border-t">
            <Card className={`p-3 transition-all duration-300 ${
              sidebarCollapsed ? 'flex justify-center' : ''
            }`}>
              {sidebarCollapsed ? (
                <div className="w-2 h-2 bg-green-500 rounded-full" title="Somnia Network Connected" />
              ) : (
                <>
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className="text-xs font-medium">Somnia Network</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Connected to Somnia blockchain</p>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className={`transition-all duration-300 ${
        sidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'
      }`}>
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex items-center justify-between px-4 py-3">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-4 w-4" />
            </Button>

            <div className="flex items-center space-x-4">
              <NotificationCenter />
              <ThemeToggle />
              <Button variant="outline" size="sm" onClick={() => setChatOpen(!chatOpen)}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat Assistant
              </Button>
              <Button variant="outline" size="sm">
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">{children}</main>
      </div>

      {/* Floating chat interface */}
      {chatOpen && (
        <div className="fixed bottom-4 right-4 z-50 w-96 h-[600px] hidden lg:block">
          <ChatInterface isOpen={chatOpen} onClose={() => setChatOpen(false)} />
        </div>
      )}
    </div>
  )
}
