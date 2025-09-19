'use client'

import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { mainnet, polygon, optimism, arbitrum, base } from 'wagmi/chains'

// Define Somnia testnet
const somniaTestnet = {
  id: 2648,
  name: 'Somnia Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'SOM',
    symbol: 'SOM',
  },
  rpcUrls: {
    default: {
      http: ['https://testnet-rpc.somnia.network'],
    },
  },
  blockExplorers: {
    default: { name: 'Somnia Explorer', url: 'https://testnet-explorer.somnia.network' },
  },
  testnet: true,
} as const

export const config = getDefaultConfig({
  appName: 'Sphira DeFi Platform',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'sphira-defi-platform',
  chains: [somniaTestnet, mainnet, polygon, optimism, arbitrum, base],
  ssr: true,
})
