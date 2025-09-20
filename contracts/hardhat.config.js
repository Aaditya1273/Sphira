require("@nomicfoundation/hardhat-toolbox")
require("hardhat-gas-reporter")
require("solidity-coverage")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.19",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    "somnia-testnet": {
      url: process.env.SOMNIA_TESTNET_RPC_URL || "https://dream-rpc.somnia.network/",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 50312, // Somnia testnet chain ID
      gasPrice: 1000000000, // 1 gwei
    },
    "somnia-mainnet": {
      url: process.env.SOMNIA_MAINNET_RPC_URL || "https://rpc.somnia.network",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 2648, // Somnia mainnet chain ID
      gasPrice: 1000000000, // 1 gwei
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: {
      "somnia-testnet": process.env.SOMNIA_API_KEY || "dummy",
      "somnia-mainnet": process.env.SOMNIA_API_KEY || "dummy",
    },
    customChains: [
      {
        network: "somnia-testnet",
        chainId: 50312,
        urls: {
          apiURL: "https://shannon-explorer.somnia.network/api",
          browserURL: "https://shannon-explorer.somnia.network/",
        },
      },
      {
        network: "somnia-mainnet",
        chainId: 2648,
        urls: {
          apiURL: "https://explorer-api.somnia.network/api",
          browserURL: "https://explorer.somnia.network",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
}
