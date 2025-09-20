#!/usr/bin/env node

/**
 * 🚀 HACKATHON DATABASE INITIALIZER
 * World's Best Temporary Database Setup
 * Run: npm run init-db
 */

const fs = require('fs')
const path = require('path')

console.log('🚀 Initializing World\'s Best Hackathon Database...')
console.log('=' .repeat(60))

// Create data directory
const dataDir = path.join(process.cwd(), 'data')
const backupDir = path.join(dataDir, 'backups')

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
  console.log('📁 Created data directory')
}

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true })
  console.log('📁 Created backup directory')
}

// Premium Demo Data
const premiumDemoData = {
  metadata: {
    version: '2.0.0',
    created: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    totalUsers: 3,
    totalTransactions: 25
  },
  users: [
    {
      id: 1,
      wallet_address: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
      created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      last_active: new Date().toISOString(),
      preferences: {
        theme: 'dark',
        currency: 'USD',
        language: 'en',
        notifications: true
      },
      stats: {
        total_invested: '12500.00',
        total_earned: '1247.89',
        active_sips: 4,
        vault_balance: '50000.00'
      }
    },
    {
      id: 2,
      wallet_address: '0x8ba1f109551bD432803012645ac136c22C177e9D',
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      last_active: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      preferences: {
        theme: 'light',
        currency: 'EUR',
        language: 'en',
        notifications: true
      },
      stats: {
        total_invested: '8750.00',
        total_earned: '892.34',
        active_sips: 2,
        vault_balance: '25000.00'
      }
    },
    {
      id: 3,
      wallet_address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      last_active: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      preferences: {
        theme: 'system',
        currency: 'USD',
        language: 'en',
        notifications: false
      },
      stats: {
        total_invested: '3200.00',
        total_earned: '156.78',
        active_sips: 1,
        vault_balance: '10000.00'
      }
    }
  ],
  sips: [
    // User 1 SIPs
    {
      id: 1,
      sip_id: 1,
      user_address: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
      token_address: '0xA0b86a33E6441e6e80D0c4C6C7527d72e1d00000',
      token_symbol: 'USDC',
      amount: '1000.00',
      frequency: 'WEEKLY',
      status: 'ACTIVE',
      created_at: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
      next_execution: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      total_deposits: '6000.00',
      execution_count: 6,
      blockchain_tx_hash: '0xabc123def456789012345678901234567890abcd',
      apy_target: 12.8
    },
    {
      id: 2,
      sip_id: 2,
      user_address: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
      token_address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      token_symbol: 'ETH',
      amount: '0.25',
      frequency: 'DAILY',
      status: 'ACTIVE',
      created_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      next_execution: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      total_deposits: '8.75',
      execution_count: 35,
      blockchain_tx_hash: '0xdef456abc789012345678901234567890abcdef1',
      apy_target: 9.2
    },
    {
      id: 3,
      sip_id: 3,
      user_address: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
      token_address: '0x1234567890123456789012345678901234567890',
      token_symbol: 'SOM',
      amount: '2000.00',
      frequency: 'MONTHLY',
      status: 'ACTIVE',
      created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      next_execution: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      total_deposits: '6000.00',
      execution_count: 3,
      blockchain_tx_hash: '0xghi789jkl012345678901234567890ghijkl234',
      apy_target: 15.5
    },
    // User 2 SIPs
    {
      id: 4,
      sip_id: 4,
      user_address: '0x8ba1f109551bD432803012645ac136c22C177e9D',
      token_address: '0xA0b86a33E6441e6e80D0c4C6C7527d72e1d00000',
      token_symbol: 'USDC',
      amount: '750.00',
      frequency: 'WEEKLY',
      status: 'ACTIVE',
      created_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
      next_execution: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      total_deposits: '3000.00',
      execution_count: 4,
      blockchain_tx_hash: '0xmno345pqr678901234567890123456789mnopqr5',
      apy_target: 11.7
    }
  ],
  yield_history: [
    {
      id: 1,
      user_address: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
      token_address: '0xA0b86a33E6441e6e80D0c4C6C7527d72e1d00000',
      pool_id: 1,
      amount: '127.45',
      apy: 12.8,
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      tx_hash: '0xyield123456789abcdef',
      strategy: 'Liquidity Pool Staking'
    },
    {
      id: 2,
      user_address: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
      token_address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      pool_id: 2,
      amount: '0.089',
      apy: 9.2,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      tx_hash: '0xyield234567890bcdef1',
      strategy: 'Ethereum Staking'
    },
    {
      id: 3,
      user_address: '0x8ba1f109551bD432803012645ac136c22C177e9D',
      token_address: '0xA0b86a33E6441e6e80D0c4C6C7527d72e1d00000',
      pool_id: 1,
      amount: '89.23',
      apy: 11.7,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      tx_hash: '0xyield345678901cdef12',
      strategy: 'Liquidity Pool Staking'
    }
  ],
  vault_locks: [
    {
      id: 1,
      lock_id: 1,
      user_address: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
      token_address: '0xA0b86a33E6441e6e80D0c4C6C7527d72e1d00000',
      amount: '50000.00',
      lock_duration: 7776000, // 90 days
      reason: 'Long-term emergency fund',
      status: 'ACTIVE',
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      unlock_time: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      tx_hash: '0xlock123456789abcdef0',
      interest_earned: '625.50'
    },
    {
      id: 2,
      lock_id: 2,
      user_address: '0x8ba1f109551bD432803012645ac136c22C177e9D',
      token_address: '0xA0b86a33E6441e6e80D0c4C6C7527d72e1d00000',
      amount: '25000.00',
      lock_duration: 2592000, // 30 days
      reason: 'Emergency fund protection',
      status: 'ACTIVE',
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      unlock_time: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      tx_hash: '0xlock234567890bcdef01',
      interest_earned: '156.25'
    }
  ],
  analytics: [
    {
      id: 1,
      event_type: 'sip_created',
      user_address: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
      data: JSON.stringify({ amount: '1000', token: 'USDC', frequency: 'WEEKLY' }),
      timestamp: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
      session_id: 'sess_abc123def'
    },
    {
      id: 2,
      event_type: 'yield_earned',
      user_address: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
      data: JSON.stringify({ amount: '127.45', token: 'USDC', apy: 12.8 }),
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      session_id: 'sess_def456ghi'
    },
    {
      id: 3,
      event_type: 'vault_locked',
      user_address: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
      data: JSON.stringify({ amount: '50000', duration: 90, reason: 'emergency' }),
      timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      session_id: 'sess_ghi789jkl'
    }
  ],
  chat_history: [
    {
      id: 1,
      user_address: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
      message: '/portfolio',
      response: 'Portfolio Summary: Total Value: $63,747.89 | Active SIPs: 4 | Vault Balance: $50,000 | Total Earned: $1,247.89',
      command: 'portfolio',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      satisfaction_rating: 5
    },
    {
      id: 2,
      user_address: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
      message: '/sip status',
      response: 'SIP Status: 4 active SIPs | Next execution: ETH SIP in 8 hours | Weekly USDC SIP in 3 days',
      command: 'sip_status',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      satisfaction_rating: 4
    },
    {
      id: 3,
      user_address: '0x8ba1f109551bD432803012645ac136c22C177e9D',
      message: 'How is my yield performance?',
      response: 'Your yield performance is excellent! Current APY: 11.7% | Total earned this month: $89.23',
      command: null,
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      satisfaction_rating: 5
    }
  ],
  portfolio_snapshots: [
    {
      id: 1,
      user_address: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
      total_value: '63747.89',
      breakdown: {
        sips: '12500.00',
        yield: '1247.89',
        vault: '50000.00'
      },
      timestamp: new Date().toISOString()
    },
    {
      id: 2,
      user_address: '0x8ba1f109551bD432803012645ac136c22C177e9D',
      total_value: '34642.34',
      breakdown: {
        sips: '8750.00',
        yield: '892.34',
        vault: '25000.00'
      },
      timestamp: new Date().toISOString()
    }
  ],
  notifications: [
    {
      id: 1,
      user_address: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
      type: 'SIP_EXECUTED',
      title: 'SIP Executed Successfully',
      message: 'Your daily ETH SIP of 0.25 ETH has been executed successfully.',
      read: false,
      created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      user_address: '0x742d35Cc6634C0532925a3b8D4C9db96590c6C87',
      type: 'YIELD_EARNED',
      title: 'Yield Earned',
      message: 'You earned $127.45 USDC from liquidity pool staking (12.8% APY).',
      read: false,
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 3,
      user_address: '0x8ba1f109551bD432803012645ac136c22C177e9D',
      type: 'YIELD_EARNED',
      title: 'Yield Earned',
      message: 'You earned $89.23 USDC from liquidity pool staking (11.7% APY).',
      read: true,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    }
  ]
}

// Write the premium database
const dbPath = path.join(dataDir, 'sphira-hackathon.json')
fs.writeFileSync(dbPath, JSON.stringify(premiumDemoData, null, 2))

console.log('✅ Premium hackathon database created!')
console.log('📊 Database Statistics:')
console.log(`   👥 Users: ${premiumDemoData.users.length}`)
console.log(`   💰 SIPs: ${premiumDemoData.sips.length}`)
console.log(`   📈 Yield Records: ${premiumDemoData.yield_history.length}`)
console.log(`   🔒 Vault Locks: ${premiumDemoData.vault_locks.length}`)
console.log(`   📱 Notifications: ${premiumDemoData.notifications.length}`)
console.log(`   💬 Chat History: ${premiumDemoData.chat_history.length}`)
console.log('')
console.log('🎯 Database Features:')
console.log('   ⚡ Lightning-fast JSON operations')
console.log('   🔄 Auto-backup system')
console.log('   📊 Real-time analytics')
console.log('   🔗 Blockchain integration ready')
console.log('   💾 Premium demo data included')
console.log('')
console.log('🚀 Ready for hackathon demo!')
console.log('=' .repeat(60))
