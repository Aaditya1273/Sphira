"use client"

// Wallet integration utilities for Somnia blockchain
export interface WalletProvider {
  isMetaMask?: boolean
  isWalletConnect?: boolean
  request: (args: { method: string; params?: any[] }) => Promise<any>
  on: (event: string, handler: (...args: any[]) => void) => void
  removeListener: (event: string, handler: (...args: any[]) => void) => void
}

export interface WalletState {
  isConnected: boolean
  address?: string
  chainId?: number
  balance?: Record<string, string>
}

export class WalletManager {
  private provider: WalletProvider | null = null
  private state: WalletState = { isConnected: false }
  private listeners: Array<(state: WalletState) => void> = []

  // Somnia network configuration
  private somniaConfig = {
    chainId: "0xa58", // 2648 in hex
    chainName: "Somnia Mainnet",
    nativeCurrency: {
      name: "SOM",
      symbol: "SOM",
      decimals: 18,
    },
    rpcUrls: ["https://rpc.somnia.network"],
    blockExplorerUrls: ["https://explorer.somnia.network"],
  }

  async connectWallet(): Promise<WalletState> {
    try {
      // Check if MetaMask is available
      if (typeof window !== "undefined" && (window as any).ethereum) {
        this.provider = (window as any).ethereum as WalletProvider

        // Request account access
        const accounts = await this.provider.request({
          method: "eth_requestAccounts",
        })

        if (accounts.length > 0) {
          const address = accounts[0]
          const chainId = await this.provider.request({ method: "eth_chainId" })

          // Switch to Somnia network if not already connected
          if (chainId !== this.somniaConfig.chainId) {
            await this.switchToSomnia()
          }

          // Get balance
          const balance = await this.getBalance(address)

          this.state = {
            isConnected: true,
            address,
            chainId: Number.parseInt(chainId, 16),
            balance,
          }

          // Set up event listeners
          this.setupEventListeners()

          this.notifyListeners()
          return this.state
        }
      }

      throw new Error("No wallet provider found")
    } catch (error) {
      console.error("Failed to connect wallet:", error)
      throw error
    }
  }

  async switchToSomnia(): Promise<void> {
    if (!this.provider) throw new Error("No wallet provider")

    try {
      await this.provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: this.somniaConfig.chainId }],
      })
    } catch (switchError: any) {
      // If the chain doesn't exist, add it
      if (switchError.code === 4902) {
        await this.provider.request({
          method: "wallet_addEthereumChain",
          params: [this.somniaConfig],
        })
      } else {
        throw switchError
      }
    }
  }

  async getBalance(address: string): Promise<Record<string, string>> {
    if (!this.provider) throw new Error("No wallet provider")

    try {
      // Get native SOM balance
      const somBalance = await this.provider.request({
        method: "eth_getBalance",
        params: [address, "latest"],
      })

      // Convert from wei to SOM
      const somBalanceFormatted = (Number.parseInt(somBalance, 16) / 1e18).toFixed(2)

      // For demo purposes, return mock balances for other tokens
      // In production, you would query token contracts
      return {
        SOM: somBalanceFormatted,
        USDC: "15420.50",
        ETH: "8.75",
      }
    } catch (error) {
      console.error("Failed to get balance:", error)
      return {}
    }
  }

  async sendTransaction(to: string, value: string, data?: string): Promise<string> {
    if (!this.provider || !this.state.address) {
      throw new Error("Wallet not connected")
    }

    try {
      const txHash = await this.provider.request({
        method: "eth_sendTransaction",
        params: [
          {
            from: this.state.address,
            to,
            value: `0x${Number.parseInt(value).toString(16)}`,
            data: data || "0x",
          },
        ],
      })

      return txHash
    } catch (error) {
      console.error("Transaction failed:", error)
      throw error
    }
  }

  async signMessage(message: string): Promise<string> {
    if (!this.provider || !this.state.address) {
      throw new Error("Wallet not connected")
    }

    try {
      const signature = await this.provider.request({
        method: "personal_sign",
        params: [message, this.state.address],
      })

      return signature
    } catch (error) {
      console.error("Message signing failed:", error)
      throw error
    }
  }

  disconnect(): void {
    this.provider = null
    this.state = { isConnected: false }
    this.notifyListeners()
  }

  getState(): WalletState {
    return this.state
  }

  onStateChange(listener: (state: WalletState) => void): () => void {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private setupEventListeners(): void {
    if (!this.provider) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        this.disconnect()
      } else {
        this.state.address = accounts[0]
        this.notifyListeners()
      }
    }

    const handleChainChanged = (chainId: string) => {
      this.state.chainId = Number.parseInt(chainId, 16)
      this.notifyListeners()
    }

    this.provider.on("accountsChanged", handleAccountsChanged)
    this.provider.on("chainChanged", handleChainChanged)
  }

  private notifyListeners(): void {
    this.listeners.forEach((listener) => listener(this.state))
  }
}

// Singleton instance
export const walletManager = new WalletManager()

// Contract interaction utilities
export const contractUtils = {
  // SIP Manager contract interactions
  async createSIP(
    token: string,
    amount: string,
    frequency: number,
    maxExecutions: number,
    penalty: number,
  ): Promise<string> {
    // Implementation would call SIPManager.createSIP()
    console.log("Creating SIP:", { token, amount, frequency, maxExecutions, penalty })
    return "0x123..." // Mock transaction hash
  },

  async executeSIP(sipId: number): Promise<string> {
    // Implementation would call SIPManager.executeSIP()
    console.log("Executing SIP:", sipId)
    return "0x456..." // Mock transaction hash
  },

  // Yield Router contract interactions
  async deposit(token: string, amount: string, maxRiskScore: number): Promise<string> {
    // Implementation would call YieldRouter.deposit()
    console.log("Depositing to yield router:", { token, amount, maxRiskScore })
    return "0x789..." // Mock transaction hash
  },

  async rebalance(token: string, maxRiskScore: number): Promise<string> {
    // Implementation would call YieldRouter.rebalance()
    console.log("Rebalancing portfolio:", { token, maxRiskScore })
    return "0xabc..." // Mock transaction hash
  },

  // Lock Vault contract interactions
  async lockFunds(token: string, amount: string, duration: number, reason: string): Promise<string> {
    // Implementation would call LockVault.lockFunds()
    console.log("Locking funds:", { token, amount, duration, reason })
    return "0xdef..." // Mock transaction hash
  },

  async withdrawFunds(lockId: number): Promise<string> {
    // Implementation would call LockVault.withdrawFunds()
    console.log("Withdrawing locked funds:", lockId)
    return "0x321..." // Mock transaction hash
  },
}
