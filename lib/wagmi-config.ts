'use client'

import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains'

// Define Somnia testnet with official configuration
const somniaTestnet = {
  id: 50312,
  name: 'Somnia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'STT',
    symbol: 'STT',
  },
  rpcUrls: {
    default: {
      http: ['https://dream-rpc.somnia.network/'],
    },
  },
  blockExplorers: {
    default: { name: 'Shannon Explorer', url: 'https://shannon-explorer.somnia.network/' },
  },
  testnet: true,
} as const

export const config = getDefaultConfig({
  appName: 'Sphira DeFi Platform',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'sphira-defi-platform',
  chains: [somniaTestnet, mainnet, polygon, optimism, arbitrum, base],
  ssr: true,
})
