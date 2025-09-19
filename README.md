# Sphira - Advanced SIP 2.0 DeFi Platform on Somnia

![Sphira Logo](./docs/assets/sphira-logo.png)

**The world's most advanced, production-ready, fully on-chain SIP 2.0 DeFi platform** built on the Somnia blockchain, combining automated SIPs, dynamic yield optimization, emergency fund locks, chat-based UX, and real-time dashboard analytics.

## 🚀 Features

### Core DeFi Features
- **Automated SIPs**: Schedule recurring deposits (daily, weekly, monthly) in USDC, ETH, SOM, or other Somnia tokens
- **Yield Optimization**: Dynamic fund distribution across Somnia DeFi pools for maximum APY
- **Emergency Fund Lock**: Multi-sig controlled emergency fund protection with community governance
- **Chat-Based UX**: Command-driven interface with `/startSIP`, `/portfolio`, `/yield`, `/lockFunds` commands
- **Real-time Analytics**: Live portfolio tracking, yield calculations, and performance metrics

### Technical Features
- **Fully On-Chain**: All financial logic runs on Somnia blockchain
- **Gas Optimized**: Sub-second transaction execution
- **Security First**: Reentrancy guards, access controls, multi-sig admin logic
- **Mobile-First**: Responsive design with dark mode support
- **WalletConnect Integration**: MetaMask and WalletConnect support

## 🏗️ Architecture

\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │ Smart Contracts │
│   (Next.js)     │◄──►│   (Next.js API) │◄──►│   (Solidity)    │
│                 │    │                 │    │                 │
│ • Dashboard     │    │ • REST API      │    │ • SIPManager    │
│ • Chat UI       │    │ • Notifications │    │ • YieldRouter   │
│ • Analytics     │    │ • Analytics     │    │ • LockVault     │
│ • Wallet        │    │ • Chat Commands │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │ Somnia Blockchain│
                    │                 │
                    │ • High TPS      │
                    │ • Sub-second    │
                    │ • EVM Compatible│
                    └─────────────────┘
\`\`\`

## 🛠️ Installation

### Prerequisites
- Node.js 20+
- npm or yarn
- MetaMask or WalletConnect compatible wallet
- Git

### Quick Start

1. **Clone the repository**
\`\`\`bash
git clone https://github.com/your-org/sphira-defi-platform.git
cd sphira-defi-platform
\`\`\`

2. **Install dependencies**
\`\`\`bash
# Install frontend dependencies
npm install

# Install contract dependencies
cd contracts
npm install
cd ..
\`\`\`

3. **Environment Setup**
\`\`\`bash
cp .env.example .env.local
\`\`\`

Configure the following environment variables:
\`\`\`env
# Somnia Network
SOMNIA_TESTNET_RPC_URL=https://testnet-rpc.somnia.network
SOMNIA_MAINNET_RPC_URL=https://mainnet-rpc.somnia.network
PRIVATE_KEY=your_private_key_here
SOMNIA_API_KEY=your_somnia_api_key

# Application
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_CHAIN_ID=2648
NEXT_PUBLIC_CHAIN_NAME=Somnia Testnet

# Optional
REPORT_GAS=true
\`\`\`

4. **Deploy Smart Contracts**
\`\`\`bash
cd contracts
npx hardhat compile
npx hardhat run scripts/deploy.js --network somnia-testnet
cd ..
\`\`\`

5. **Start Development Server**
\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the application.

## 📖 Usage Guide

### Creating Your First SIP

1. **Connect Wallet**: Click "Connect Wallet" and select MetaMask
2. **Navigate to SIPs**: Go to the SIPs page from the dashboard
3. **Create SIP**: Click "Create New SIP" and configure:
   - Amount: e.g., 100 USDC
   - Frequency: Daily, Weekly, or Monthly
   - Duration: Number of periods
   - Token: USDC, ETH, SOM, etc.

### Using Chat Commands

Open the chat interface and try these commands:

\`\`\`
/startSIP 100 USDC weekly
/portfolio
/yield
/lockFunds 500 USDC
/help
\`\`\`

### Yield Optimization

The YieldRouter automatically distributes your funds across the best-performing Somnia DeFi pools:
- **Liquidity Pools**: Automated market makers
- **Lending Protocols**: Compound-style lending
- **Staking Rewards**: Native SOM staking

### Emergency Fund Lock

Protect your funds with the LockVault:
1. Navigate to Emergency Vault
2. Lock funds with custom unlock conditions
3. Multi-sig approval required for emergency unlocks

## 🧪 Testing

### Smart Contract Tests
\`\`\`bash
cd contracts
npm test
\`\`\`

### Frontend Tests
\`\`\`bash
npm run test
\`\`\`

### Integration Tests
\`\`\`bash
npm run test:integration
\`\`\`

### Security Audit
\`\`\`bash
cd contracts
npm run audit
\`\`\`

## 🚀 Deployment

### Testnet Deployment
\`\`\`bash
npm run deploy:testnet
\`\`\`

### Mainnet Deployment
\`\`\`bash
npm run deploy:mainnet
\`\`\`

### Docker Deployment
\`\`\`bash
docker-compose up -d
\`\`\`

## 📊 Demo Script

### 1. Dashboard Overview
- View portfolio balance: $10,000
- Active SIPs: 3 running
- Total yield earned: $250 (2.5% APY)
- Emergency funds locked: $2,000

### 2. Create SIP via Chat
\`\`\`
User: /startSIP 50 USDC weekly
Bot: ✅ SIP created! 50 USDC weekly for 12 weeks. Total: $600
\`\`\`

### 3. Yield Optimization
- View current allocations across 5 pools
- Best performing: Somnia-USDC LP (15% APY)
- Auto-rebalancing every 24 hours

### 4. Emergency Lock Demo
\`\`\`
User: /lockFunds 1000 USDC
Bot: 🔒 Emergency lock created. Requires 3/5 multi-sig for unlock.
\`\`\`

## 🔧 API Documentation

### REST Endpoints

#### SIPs
- `GET /api/sips` - List all SIPs
- `POST /api/sips` - Create new SIP
- `GET /api/sips/[id]` - Get SIP details
- `PUT /api/sips/[id]` - Update SIP
- `DELETE /api/sips/[id]` - Cancel SIP

#### Portfolio
- `GET /api/portfolio` - Get portfolio overview
- `GET /api/portfolio/history` - Get historical data

#### Yield
- `GET /api/yield/pools` - List available pools
- `GET /api/yield/allocations` - Current allocations

#### Chat
- `POST /api/chat` - Process chat command

### WebSocket Events
- `sip_executed` - SIP deposit completed
- `yield_updated` - Yield calculation updated
- `emergency_triggered` - Emergency event

## 🔐 Security

### Smart Contract Security
- **Reentrancy Guards**: All external calls protected
- **Access Control**: Role-based permissions
- **Multi-sig**: Critical operations require multiple signatures
- **Gas Optimization**: Efficient execution for high TPS

### Audit Tools
- Slither static analysis
- MythX security scanning
- Manual code review checklist

### Bug Bounty
Report security vulnerabilities to security@sphira.finance

## 🔮 Future Upgrades

### Phase 2: zkML Integration
- On-chain risk scoring
- Automated yield optimization
- Predictive analytics

### Phase 3: zkKYC/DID
- Compliant onboarding
- Identity verification
- Regulatory compliance

### Phase 4: Cross-Chain
- Ethereum bridge
- BSC integration
- Solana compatibility

### Phase 5: Gamification
- NFT achievement badges
- Community leaderboards
- Governance tokens

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- Documentation: [docs.sphira.finance](https://docs.sphira.finance)
- Discord: [discord.gg/sphira](https://discord.gg/sphira)
- Email: support@sphira.finance
- Bug Reports: [GitHub Issues](https://github.com/your-org/sphira-defi-platform/issues)

## 🙏 Acknowledgments

- Somnia blockchain team for the high-performance infrastructure
- OpenZeppelin for security-first smart contract libraries
- Next.js and Vercel for the development platform
- The DeFi community for inspiration and feedback

---

**Built with ❤️ for the future of decentralized finance**
