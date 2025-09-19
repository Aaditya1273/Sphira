"use client"

import { useState, useEffect } from "react"
import { useAccount, useBalance } from "wagmi"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, AlertTriangle, Wallet } from "lucide-react"
import { formatEther, parseEther } from "viem"

export function CreateSIPDialog() {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    token: "",
    amount: "",
    frequency: "",
    duration: "",
    penalty: "2",
    reason: ""
  })
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState("")
  
  const { address, isConnected } = useAccount()
  
  // Get balances for different tokens
  const { data: somBalance } = useBalance({
    address: address,
  })
  
  const { data: usdcBalance } = useBalance({
    address: address,
    token: process.env.NEXT_PUBLIC_USDC_ADDRESS as `0x${string}`,
  })
  
  const { data: ethBalance } = useBalance({
    address: address,
    token: process.env.NEXT_PUBLIC_ETH_ADDRESS as `0x${string}`,
  })

  const getTokenBalance = (token: string) => {
    switch (token.toLowerCase()) {
      case 'som':
        return somBalance
      case 'usdc':
        return usdcBalance
      case 'eth':
        return ethBalance
      default:
        return null
    }
  }

  const validateAmount = () => {
    if (!formData.token || !formData.amount) return true
    
    const balance = getTokenBalance(formData.token)
    if (!balance) return true
    
    try {
      const requestedAmount = parseFloat(formData.amount)
      const availableBalance = parseFloat(formatEther(balance.value))
      
      // Handle different token decimals properly
      if (formData.token.toLowerCase() === 'usdc') {
        // USDC has 6 decimals, but we're getting it in wei (18 decimals)
        // So we need to convert properly
        const usdcBalance = parseFloat(balance.formatted || formatEther(balance.value))
        return usdcBalance >= requestedAmount
      } else {
        // For SOM and ETH (18 decimals)
        return availableBalance >= requestedAmount
      }
    } catch {
      return false
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError("")
  }

  const handleCreateSIP = async () => {
    if (!isConnected) {
      setError("Please connect your wallet first")
      return
    }

    if (!formData.name || !formData.token || !formData.amount || !formData.frequency) {
      setError("Please fill in all required fields")
      return
    }

    if (!validateAmount()) {
      const balance = getTokenBalance(formData.token)
      let balanceFormatted = "0"
      
      if (balance) {
        if (formData.token.toLowerCase() === 'usdc') {
          balanceFormatted = parseFloat(balance.formatted || formatEther(balance.value)).toFixed(2)
        } else {
          balanceFormatted = parseFloat(formatEther(balance.value)).toFixed(4)
        }
      }
      
      setError(`Insufficient balance. You have ${balanceFormatted} ${formData.token.toUpperCase()}, but trying to invest ${formData.amount}`)
      return
    }

    setIsCreating(true)
    setError("")

    try {
      // Call the API to create SIP
      const response = await fetch('/api/sips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          token: formData.token,
          amount: formData.amount,
          frequency: formData.frequency,
          userAddress: address,
          duration: formData.duration,
          penalty: formData.penalty,
          reason: formData.reason
        }),
      })

      const result = await response.json()

      if (result.success) {
        // Reset form and close dialog
        setFormData({
          name: "",
          token: "",
          amount: "",
          frequency: "",
          duration: "",
          penalty: "2",
          reason: ""
        })
        setOpen(false)
        // Dispatch custom event to refresh SIP list
        window.dispatchEvent(new CustomEvent('sipCreated', { detail: result.data }))
      } else {
        setError(result.error || "Failed to create SIP")
      }
    } catch (error) {
      setError("Failed to create SIP. Please try again.")
    } finally {
      setIsCreating(false)
    }
  }

  const selectedBalance = getTokenBalance(formData.token)
  const isAmountValid = validateAmount()

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 shadow-lg">
          <Plus className="h-4 w-4 mr-2" />
          Create SIP
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card/80 backdrop-blur-xl border-0 shadow-2xl">
        <DialogHeader>
          <DialogTitle>Create New SIP</DialogTitle>
          <DialogDescription>Set up a systematic investment plan to automate your DeFi investments.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {!isConnected && (
            <Alert>
              <Wallet className="h-4 w-4" />
              <AlertDescription>
                Please connect your wallet to create a SIP
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="name">SIP Name *</Label>
            <Input 
              id="name" 
              placeholder="e.g., USDC Growth Plan" 
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="token">Token *</Label>
              <Select value={formData.token} onValueChange={(value) => handleInputChange("token", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select token" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="som">
                    SOM {somBalance && `(${parseFloat(formatEther(somBalance.value)).toFixed(4)})`}
                  </SelectItem>
                  <SelectItem value="usdc">
                    USDC {usdcBalance && `(${parseFloat(usdcBalance.formatted || formatEther(usdcBalance.value)).toFixed(2)})`}
                  </SelectItem>
                  <SelectItem value="eth">
                    ETH {ethBalance && `(${parseFloat(ethBalance.formatted || formatEther(ethBalance.value)).toFixed(4)})`}
                  </SelectItem>
                </SelectContent>
              </Select>
              {selectedBalance && (
                <p className="text-xs text-muted-foreground">
                  Balance: {
                    formData.token.toLowerCase() === 'usdc' 
                      ? parseFloat(selectedBalance.formatted || formatEther(selectedBalance.value)).toFixed(2)
                      : parseFloat(formatEther(selectedBalance.value)).toFixed(4)
                  } {formData.token.toUpperCase()}
                </p>
              )}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount *</Label>
              <Input 
                id="amount" 
                type="number" 
                placeholder="500" 
                value={formData.amount}
                onChange={(e) => handleInputChange("amount", e.target.value)}
                className={!isAmountValid ? "border-red-500" : ""}
              />
              {formData.amount && !isAmountValid && (
                <p className="text-xs text-red-500">Insufficient balance</p>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="frequency">Frequency *</Label>
              <Select value={formData.frequency} onValueChange={(value) => handleInputChange("frequency", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (months)</Label>
              <Input 
                id="duration" 
                type="number" 
                placeholder="12" 
                value={formData.duration}
                onChange={(e) => handleInputChange("duration", e.target.value)}
              />
            </div>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="penalty">Early Withdrawal Penalty (%)</Label>
            <Input 
              id="penalty" 
              type="number" 
              placeholder="2" 
              min="0" 
              max="10" 
              value={formData.penalty}
              onChange={(e) => handleInputChange("penalty", e.target.value)}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="reason">Investment Goal</Label>
            <Textarea 
              id="reason" 
              placeholder="Describe your investment goal..." 
              value={formData.reason}
              onChange={(e) => handleInputChange("reason", e.target.value)}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isCreating}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleCreateSIP}
            disabled={!isConnected || isCreating || !isAmountValid || !formData.name || !formData.token || !formData.amount || !formData.frequency}
          >
            {isCreating ? "Creating..." : "Create SIP"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
