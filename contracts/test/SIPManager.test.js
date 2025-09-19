const { expect } = require("chai")
const { ethers } = require("hardhat")
const { time, loadFixture } = require("@nomicfoundation/hardhat-network-helpers")

describe("SIPManager", () => {
  async function deploySIPManagerFixture() {
    const [owner, user1, user2] = await ethers.getSigners()

    // Deploy mock ERC20 token
    const MockToken = await ethers.getContractFactory("MockERC20")
    const usdc = await MockToken.deploy("USD Coin", "USDC", 6)
    const eth = await MockToken.deploy("Ethereum", "ETH", 18)

    // Deploy SIPManager
    const SIPManager = await ethers.getContractFactory("SIPManager")
    const sipManager = await SIPManager.deploy()

    // Setup supported tokens
    await sipManager.setSupportedToken(usdc.address, true)
    await sipManager.setSupportedToken(eth.address, true)

    // Mint tokens to users
    await usdc.mint(user1.address, ethers.utils.parseUnits("10000", 6))
    await eth.mint(user1.address, ethers.utils.parseEther("100"))

    return { sipManager, usdc, eth, owner, user1, user2 }
  }

  describe("Deployment", () => {
    it("Should set the right owner", async () => {
      const { sipManager, owner } = await loadFixture(deploySIPManagerFixture)
      expect(await sipManager.owner()).to.equal(owner.address)
    })

    it("Should start with nextSIPId as 1", async () => {
      const { sipManager } = await loadFixture(deploySIPManagerFixture)
      expect(await sipManager.nextSIPId()).to.equal(1)
    })
  })

  describe("Token Management", () => {
    it("Should allow owner to add supported tokens", async () => {
      const { sipManager, usdc, owner } = await loadFixture(deploySIPManagerFixture)

      await expect(sipManager.connect(owner).setSupportedToken(usdc.address, true))
        .to.emit(sipManager, "TokenSupported")
        .withArgs(usdc.address, true)

      expect(await sipManager.supportedTokens(usdc.address)).to.be.true
    })

    it("Should not allow non-owner to add supported tokens", async () => {
      const { sipManager, usdc, user1 } = await loadFixture(deploySIPManagerFixture)

      await expect(sipManager.connect(user1).setSupportedToken(usdc.address, true)).to.be.revertedWith(
        "Ownable: caller is not the owner",
      )
    })
  })

  describe("SIP Creation", () => {
    it("Should create a SIP successfully", async () => {
      const { sipManager, usdc, user1 } = await loadFixture(deploySIPManagerFixture)

      const amount = ethers.utils.parseUnits("100", 6)
      const frequency = 1 // Weekly
      const maxExecutions = 12
      const penalty = 200 // 2%

      await expect(sipManager.connect(user1).createSIP(usdc.address, amount, frequency, maxExecutions, penalty))
        .to.emit(sipManager, "SIPCreated")
        .withArgs(1, user1.address, usdc.address, amount, frequency)

      const sip = await sipManager.getSIP(1)
      expect(sip.user).to.equal(user1.address)
      expect(sip.token).to.equal(usdc.address)
      expect(sip.amount).to.equal(amount)
      expect(sip.frequency).to.equal(frequency)
      expect(sip.maxExecutions).to.equal(maxExecutions)
      expect(sip.earlyWithdrawalPenalty).to.equal(penalty)
      expect(sip.status).to.equal(0) // ACTIVE
    })

    it("Should fail to create SIP with unsupported token", async () => {
      const { sipManager, user1 } = await loadFixture(deploySIPManagerFixture)

      const fakeToken = ethers.constants.AddressZero
      const amount = ethers.utils.parseUnits("100", 6)

      await expect(
        sipManager.connect(user1).createSIP(
          fakeToken,
          amount,
          1, // Weekly
          12,
          200,
        ),
      ).to.be.revertedWith("Token not supported")
    })

    it("Should fail to create SIP with zero amount", async () => {
      const { sipManager, usdc, user1 } = await loadFixture(deploySIPManagerFixture)

      await expect(
        sipManager.connect(user1).createSIP(
          usdc.address,
          0,
          1, // Weekly
          12,
          200,
        ),
      ).to.be.revertedWith("Amount must be greater than 0")
    })

    it("Should fail to create SIP with penalty too high", async () => {
      const { sipManager, usdc, user1 } = await loadFixture(deploySIPManagerFixture)

      const amount = ethers.utils.parseUnits("100", 6)

      await expect(
        sipManager.connect(user1).createSIP(
          usdc.address,
          amount,
          1, // Weekly
          12,
          1500, // 15% - too high
        ),
      ).to.be.revertedWith("Penalty too high")
    })
  })

  describe("SIP Execution", () => {
    it("Should execute SIP successfully", async () => {
      const { sipManager, usdc, user1 } = await loadFixture(deploySIPManagerFixture)

      const amount = ethers.utils.parseUnits("100", 6)

      // Create SIP
      await sipManager.connect(user1).createSIP(
        usdc.address,
        amount,
        1, // Weekly
        12,
        200,
      )

      // Approve tokens
      await usdc.connect(user1).approve(sipManager.address, amount)

      // Execute SIP
      await expect(sipManager.executeSIP(1))
        .to.emit(sipManager, "SIPExecuted")
        .withArgs(1, user1.address, amount, (await time.latest()) + 1)

      const sip = await sipManager.getSIP(1)
      expect(sip.totalDeposits).to.equal(amount)
      expect(sip.executionCount).to.equal(1)
    })

    it("Should not execute SIP before time", async () => {
      const { sipManager, usdc, user1 } = await loadFixture(deploySIPManagerFixture)

      const amount = ethers.utils.parseUnits("100", 6)

      // Create SIP
      await sipManager.connect(user1).createSIP(
        usdc.address,
        amount,
        1, // Weekly
        12,
        200,
      )

      // Approve and execute first time
      await usdc.connect(user1).approve(sipManager.address, amount.mul(2))
      await sipManager.executeSIP(1)

      // Try to execute again immediately
      expect(await sipManager.canExecuteSIP(1)).to.be.false
    })

    it("Should complete SIP after max executions", async () => {
      const { sipManager, usdc, user1 } = await loadFixture(deploySIPManagerFixture)

      const amount = ethers.utils.parseUnits("100", 6)
      const maxExecutions = 2

      // Create SIP with max 2 executions
      await sipManager.connect(user1).createSIP(
        usdc.address,
        amount,
        0, // Daily for faster testing
        maxExecutions,
        200,
      )

      // Approve tokens for all executions
      await usdc.connect(user1).approve(sipManager.address, amount.mul(maxExecutions))

      // Execute first time
      await sipManager.executeSIP(1)

      // Advance time and execute second time
      await time.increase(24 * 60 * 60) // 1 day
      await sipManager.executeSIP(1)

      const sip = await sipManager.getSIP(1)
      expect(sip.status).to.equal(3) // COMPLETED
      expect(sip.executionCount).to.equal(maxExecutions)
    })
  })

  describe("SIP Management", () => {
    it("Should pause and resume SIP", async () => {
      const { sipManager, usdc, user1 } = await loadFixture(deploySIPManagerFixture)

      // Create SIP
      await sipManager.connect(user1).createSIP(
        usdc.address,
        ethers.utils.parseUnits("100", 6),
        1, // Weekly
        12,
        200,
      )

      // Pause SIP
      await expect(sipManager.connect(user1).pauseSIP(1)).to.emit(sipManager, "SIPPaused").withArgs(1, user1.address)

      let sip = await sipManager.getSIP(1)
      expect(sip.status).to.equal(1) // PAUSED

      // Resume SIP
      await expect(sipManager.connect(user1).resumeSIP(1)).to.emit(sipManager, "SIPResumed").withArgs(1, user1.address)

      sip = await sipManager.getSIP(1)
      expect(sip.status).to.equal(0) // ACTIVE
    })

    it("Should cancel SIP", async () => {
      const { sipManager, usdc, user1 } = await loadFixture(deploySIPManagerFixture)

      // Create SIP
      await sipManager.connect(user1).createSIP(
        usdc.address,
        ethers.utils.parseUnits("100", 6),
        1, // Weekly
        12,
        200,
      )

      // Cancel SIP
      await expect(sipManager.connect(user1).cancelSIP(1))
        .to.emit(sipManager, "SIPCancelled")
        .withArgs(1, user1.address)

      const sip = await sipManager.getSIP(1)
      expect(sip.status).to.equal(2) // CANCELLED
    })

    it("Should not allow non-owner to manage SIP", async () => {
      const { sipManager, usdc, user1, user2 } = await loadFixture(deploySIPManagerFixture)

      // Create SIP as user1
      await sipManager.connect(user1).createSIP(
        usdc.address,
        ethers.utils.parseUnits("100", 6),
        1, // Weekly
        12,
        200,
      )

      // Try to pause as user2
      await expect(sipManager.connect(user2).pauseSIP(1)).to.be.revertedWith("Not SIP owner")
    })
  })

  describe("Early Withdrawal", () => {
    it("Should allow early withdrawal with penalty", async () => {
      const { sipManager, usdc, user1 } = await loadFixture(deploySIPManagerFixture)

      const amount = ethers.utils.parseUnits("100", 6)
      const penalty = 200 // 2%

      // Create and execute SIP
      await sipManager.connect(user1).createSIP(
        usdc.address,
        amount,
        1, // Weekly
        12,
        penalty,
      )

      await usdc.connect(user1).approve(sipManager.address, amount)
      await sipManager.executeSIP(1)

      // Early withdrawal
      const withdrawAmount = amount
      const expectedPenalty = withdrawAmount.mul(penalty).div(10000)
      const expectedWithdraw = withdrawAmount.sub(expectedPenalty)

      await expect(sipManager.connect(user1).earlyWithdrawal(1, withdrawAmount))
        .to.emit(sipManager, "EarlyWithdrawal")
        .withArgs(1, user1.address, expectedWithdraw, expectedPenalty)
    })

    it("Should not allow withdrawal more than deposited", async () => {
      const { sipManager, usdc, user1 } = await loadFixture(deploySIPManagerFixture)

      const amount = ethers.utils.parseUnits("100", 6)

      // Create SIP (no execution)
      await sipManager.connect(user1).createSIP(
        usdc.address,
        amount,
        1, // Weekly
        12,
        200,
      )

      // Try to withdraw more than deposited
      await expect(sipManager.connect(user1).earlyWithdrawal(1, amount)).to.be.revertedWith("Insufficient balance")
    })
  })

  describe("Utility Functions", () => {
    it("Should return correct frequency intervals", async () => {
      const { sipManager } = await loadFixture(deploySIPManagerFixture)

      expect(await sipManager.getFrequencyInterval(0)).to.equal(24 * 60 * 60) // Daily
      expect(await sipManager.getFrequencyInterval(1)).to.equal(7 * 24 * 60 * 60) // Weekly
      expect(await sipManager.getFrequencyInterval(2)).to.equal(30 * 24 * 60 * 60) // Monthly
    })

    it("Should return user SIPs", async () => {
      const { sipManager, usdc, user1 } = await loadFixture(deploySIPManagerFixture)

      const amount = ethers.utils.parseUnits("100", 6)

      // Create multiple SIPs
      await sipManager.connect(user1).createSIP(usdc.address, amount, 1, 12, 200)
      await sipManager.connect(user1).createSIP(usdc.address, amount, 2, 6, 300)

      const userSIPs = await sipManager.getUserSIPs(user1.address)
      expect(userSIPs.length).to.equal(2)
      expect(userSIPs[0]).to.equal(1)
      expect(userSIPs[1]).to.equal(2)
    })
  })
})
