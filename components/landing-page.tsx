"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { Zap, Shield, TrendingUp, Wallet } from "lucide-react"

export function LandingPage() {
  const [isConnected, setIsConnected] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkWalletConnection()
  }, [])

  const checkWalletConnection = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' })
        if (accounts.length > 0) {
          setWalletAddress(accounts[0])
          setIsConnected(true)
        }
      } catch (error) {
        console.log("Wallet not connected")
      }
    }
  }

  const connectWallet = async () => {
    if (typeof window !== "undefined" && (window as any).ethereum) {
      setIsConnecting(true)
      try {
        const accounts = await (window as any).ethereum.request({ 
          method: 'eth_requestAccounts' 
        })
        
        if (accounts.length > 0) {
          setWalletAddress(accounts[0])
          setIsConnected(true)
          
          // Redirect to dashboard after successful connection
          setTimeout(() => {
            router.push('/dashboard')
          }, 1000)
        }
      } catch (error) {
        console.error("Failed to connect wallet:", error)
        alert("Failed to connect wallet. Please try again.")
      } finally {
        setIsConnecting(false)
      }
    } else {
      alert("Please install MetaMask or another Web3 wallet to continue.")
    }
  }

  const launchApp = () => {
    if (isConnected) {
      router.push('/dashboard')
    } else {
      connectWallet()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <nav className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            SPHIRA
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
            <a href="#stats" className="text-gray-300 hover:text-white transition-colors">Stats</a>
          </div>
          <Button 
            onClick={launchApp}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full transition-all duration-300 transform hover:scale-105"
            disabled={isConnecting}
          >
            {isConnecting ? "Connecting..." : isConnected ? "Launch App" : "Connect Wallet"}
          </Button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex items-center justify-center min-h-[80vh] px-6">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">
            The Future of DeFi
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Advanced SIP 2.0 platform with automated yields, emergency locks, and real-time analytics on Somnia blockchain
          </p>
          
          {isConnected ? (
            <div className="space-y-4">
              <p className="text-green-400 text-lg">✅ Wallet Connected: {walletAddress.slice(0,6)}...{walletAddress.slice(-4)}</p>
              <Button 
                onClick={() => router.push('/dashboard')}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 text-xl rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Launch Dashboard
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              <Button 
                onClick={connectWallet}
                disabled={isConnecting}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-xl rounded-full transition-all duration-300 transform hover:scale-105"
              >
                {isConnecting ? "Connecting Wallet..." : "Connect Wallet to Start"}
              </Button>
              <p className="text-gray-400">Connect your Web3 wallet to access the platform</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Revolutionary Features
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">Automated SIPs</h3>
                <p className="text-gray-400">Schedule recurring deposits with intelligent optimization</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Zap className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">Yield Optimization</h3>
                <p className="text-gray-400">AI-powered fund distribution for maximum returns</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">Emergency Vault</h3>
                <p className="text-gray-400">Secure emergency fund protection with time locks</p>
              </CardContent>
            </Card>
            
            <Card className="bg-slate-900/50 border-purple-500/20 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Wallet className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2 text-white">Somnia Blockchain</h3>
                <p className="text-gray-400">High TPS, low fees, instant execution</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="relative z-10 py-20 px-6 bg-slate-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-16 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Platform Stats
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">$2M+</div>
              <div className="text-gray-400">Total Value Locked</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">15%</div>
              <div className="text-gray-400">Average APY</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">1,000+</div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-400 mb-2">99.9%</div>
              <div className="text-gray-400">Uptime</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-white to-purple-400 bg-clip-text text-transparent">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-gray-300 mb-12">
            Join the future of decentralized finance with Sphira
          </p>
          <Button 
            onClick={launchApp}
            disabled={isConnecting}
            className="bg-purple-600 hover:bg-purple-700 text-white px-12 py-4 text-xl rounded-full transition-all duration-300 transform hover:scale-105"
          >
            {isConnecting ? "Connecting..." : isConnected ? "Launch App" : "Get Started Now"}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-4">
            SPHIRA
          </div>
          <p className="text-gray-400">
            Built for the future of decentralized finance • Powered by Somnia Blockchain
          </p>
        </div>
      </footer>
    </div>
  )
}
