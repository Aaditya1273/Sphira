const { ethers } = require("hardhat")
const hre = require("hardhat") // Declare hre variable

async function main() {
  console.log("Deploying Sphira DeFi Platform contracts to Somnia...")

  // Get the deployer account
  const [deployer] = await ethers.getSigners()
  console.log("Deploying contracts with account:", deployer.address)
  console.log("Account balance:", (await deployer.getBalance()).toString())

  // Deploy SIPManager
  console.log("\n1. Deploying SIPManager...")
  const SIPManager = await ethers.getContractFactory("SIPManager")
  const sipManager = await SIPManager.deploy()
  await sipManager.deployed()
  console.log("SIPManager deployed to:", sipManager.address)

  // Deploy YieldRouter
  console.log("\n2. Deploying YieldRouter...")
  const YieldRouter = await ethers.getContractFactory("YieldRouter")
  const yieldRouter = await YieldRouter.deploy()
  await yieldRouter.deployed()
  console.log("YieldRouter deployed to:", yieldRouter.address)

  // Deploy LockVault
  console.log("\n3. Deploying LockVault...")
  const LockVault = await ethers.getContractFactory("LockVault")
  const lockVault = await LockVault.deploy()
  await lockVault.deployed()
  console.log("LockVault deployed to:", lockVault.address)

  // Setup initial configuration
  console.log("\n4. Setting up initial configuration...")

  // Add supported tokens to SIPManager (example tokens)
  const USDC_ADDRESS = "0x0000000000000000000000000000000000000001" // Replace with actual USDC on Somnia
  const ETH_ADDRESS = "0x0000000000000000000000000000000000000002" // Replace with actual WETH on Somnia
  const SOM_ADDRESS = "0x0000000000000000000000000000000000000003" // Replace with actual SOM token

  await sipManager.setSupportedToken(USDC_ADDRESS, true)
  await sipManager.setSupportedToken(ETH_ADDRESS, true)
  await sipManager.setSupportedToken(SOM_ADDRESS, true)
  console.log("Supported tokens configured")

  // Add example yield pools to YieldRouter
  await yieldRouter.addPool(
    "0x0000000000000000000000000000000000000010", // Example pool address
    USDC_ADDRESS,
    500, // 5% APY
    ethers.utils.parseEther("1000000"), // 1M max capacity
    3, // Risk score
  )
  console.log("Example yield pool added")

  // Grant roles to deployer for LockVault
  const EMERGENCY_ROLE = await lockVault.EMERGENCY_ROLE()
  const GOVERNANCE_ROLE = await lockVault.GOVERNANCE_ROLE()

  await lockVault.grantRole(EMERGENCY_ROLE, deployer.address)
  await lockVault.grantRole(GOVERNANCE_ROLE, deployer.address)
  console.log("Emergency and governance roles granted")

  console.log("\n✅ Deployment completed successfully!")
  console.log("\nContract Addresses:")
  console.log("==================")
  console.log("SIPManager:", sipManager.address)
  console.log("YieldRouter:", yieldRouter.address)
  console.log("LockVault:", lockVault.address)

  console.log("\nNext Steps:")
  console.log("1. Update frontend configuration with contract addresses")
  console.log("2. Verify contracts on Somnia explorer")
  console.log("3. Configure real token addresses and yield pools")
  console.log("4. Set up multi-sig for governance roles")

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      SIPManager: sipManager.address,
      YieldRouter: yieldRouter.address,
      LockVault: lockVault.address,
    },
  }

  const fs = require("fs")
  fs.writeFileSync(`deployments/${hre.network.name}.json`, JSON.stringify(deploymentInfo, null, 2))
  console.log(`\nDeployment info saved to deployments/${hre.network.name}.json`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
