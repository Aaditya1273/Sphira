"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, Key, Smartphone, AlertTriangle, CheckCircle, Clock, Lock, Eye, EyeOff } from "lucide-react"
import { useState } from "react"

export default function SecurityPage() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [biometricEnabled, setBiometricEnabled] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)

  const securityEvents = [
    {
      id: 1,
      type: "login",
      description: "Successful wallet connection",
      timestamp: "2024-01-15T10:30:00Z",
      location: "Chrome Browser",
      status: "success"
    },
    {
      id: 2,
      type: "transaction",
      description: "SIP deposit of 500 USDC",
      timestamp: "2024-01-15T09:15:00Z",
      location: "MetaMask",
      status: "success"
    },
    {
      id: 3,
      type: "security",
      description: "Wallet signature verified",
      timestamp: "2024-01-15T08:45:00Z",
      location: "Somnia Network",
      status: "success"
    }
  ]

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Security</h1>
          <p className="text-muted-foreground">Manage your wallet security and monitor activity</p>
        </div>

        {/* Security Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Score</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">95/100</div>
              <p className="text-xs text-muted-foreground">Excellent security</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Sessions</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Chrome, Mobile</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">No recent alerts</p>
            </CardContent>
          </Card>
        </div>

        {/* Wallet Security */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Wallet Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Smartphone className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Hardware Wallet</p>
                    <p className="text-sm text-muted-foreground">Use hardware wallet for signing</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={twoFactorEnabled ? "default" : "secondary"}>
                    {twoFactorEnabled ? "Connected" : "Disconnected"}
                  </Badge>
                  <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Transaction Signing</p>
                    <p className="text-sm text-muted-foreground">Require signature for all transactions</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={biometricEnabled ? "default" : "secondary"}>
                    {biometricEnabled ? "Required" : "Optional"}
                  </Badge>
                  <Switch checked={biometricEnabled} onCheckedChange={setBiometricEnabled} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                API Access
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex gap-2">
                  <Input 
                    value={showApiKey ? "sph_demo_1234567890abcdef1234567890abcdef" : "••••••••••••••••••••••••••••••••"} 
                    readOnly 
                    className="font-mono text-sm"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  Generate New Key
                </Button>
              </div>

              <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800">
                <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 mb-1">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="text-sm font-medium">Backup Reminder</span>
                </div>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  Make sure to backup your wallet recovery phrase securely.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {securityEvents.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400">
                      {event.type === 'login' && <Shield className="h-4 w-4" />}
                      {event.type === 'transaction' && <CheckCircle className="h-4 w-4" />}
                      {event.type === 'security' && <Key className="h-4 w-4" />}
                    </div>
                    <div>
                      <p className="font-medium">{event.description}</p>
                      <p className="text-sm text-muted-foreground">{event.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="default" className="mb-1">
                      {event.status}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {new Date(event.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
