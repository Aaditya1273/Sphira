import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, Shield, Users, AlertTriangle } from "lucide-react"

export default function VaultPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-balance">Emergency Vault</h1>
          <p className="text-muted-foreground text-pretty">
            Secure emergency funds with multi-signature protection and governance controls
          </p>
        </div>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Emergency funds are secured with multi-signature protection and can only be unlocked through community
            governance or emergency protocols.
          </AlertDescription>
        </Alert>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Locked Funds
              </CardTitle>
              <CardDescription>Funds secured in emergency vault</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold">$25,000.00</p>
                <p className="text-sm text-muted-foreground">Total locked value</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">USDC</span>
                  <span className="text-sm font-medium">$15,000.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">ETH</span>
                  <span className="text-sm font-medium">$7,500.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">SOM</span>
                  <span className="text-sm font-medium">$2,500.00</span>
                </div>
              </div>

              <Button className="w-full" disabled>
                <Lock className="mr-2 h-4 w-4" />
                Funds Locked
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Governance Status
              </CardTitle>
              <CardDescription>Multi-signature and governance controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Required Signatures</span>
                  <Badge variant="outline">3 of 5</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Emergency Protocol</span>
                  <Badge variant="secondary">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Governance Delay</span>
                  <Badge variant="outline">48 hours</Badge>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Emergency unlocks require community consensus or critical security events.
                </AlertDescription>
              </Alert>

              <Button variant="outline" className="w-full bg-transparent">
                View Governance Proposals
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
