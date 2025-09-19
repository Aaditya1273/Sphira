"use client"

import { DashboardLayout } from "@/components/dashboard-layout"
import { ChatInterface } from "@/components/chat-interface"
import { WalletConnection } from "@/components/wallet-connection"

export default function ChatPage() {
  return (
    <DashboardLayout>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChatInterface isOpen={true} onClose={() => {}} />
        </div>
        <div className="space-y-6">
          <WalletConnection />
        </div>
      </div>
    </DashboardLayout>
  )
}
