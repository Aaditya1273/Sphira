// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title SIPManager
 * @dev Manages Systematic Investment Plans (SIPs) on Somnia blockchain
 * @notice Handles recurring deposits, withdrawals, and SIP lifecycle management
 */
contract SIPManager is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    // SIP frequency options
    enum Frequency { DAILY, WEEKLY, MONTHLY }
    
    // SIP status
    enum Status { ACTIVE, PAUSED, CANCELLED, COMPLETED }

    struct SIP {
        address user;
        address token;
        uint256 amount;
        Frequency frequency;
        uint256 startTime;
        uint256 lastExecuted;
        uint256 totalDeposits;
        uint256 executionCount;
        uint256 maxExecutions;
        Status status;
        uint256 earlyWithdrawalPenalty; // Basis points (100 = 1%)
    }

    // State variables
    mapping(uint256 => SIP) public sips;
    mapping(address => uint256[]) public userSIPs;
    mapping(address => bool) public supportedTokens;
    
    uint256 public nextSIPId = 1;
    uint256 public constant MAX_PENALTY = 1000; // 10% max penalty
    uint256 public constant BASIS_POINTS = 10000;
    
    // Events
    event SIPCreated(
        uint256 indexed sipId,
        address indexed user,
        address indexed token,
        uint256 amount,
        Frequency frequency
    );
    
    event SIPExecuted(
        uint256 indexed sipId,
        address indexed user,
        uint256 amount,
        uint256 timestamp
    );
    
    event SIPCancelled(uint256 indexed sipId, address indexed user);
    event SIPPaused(uint256 indexed sipId, address indexed user);
    event SIPResumed(uint256 indexed sipId, address indexed user);
    event EarlyWithdrawal(uint256 indexed sipId, address indexed user, uint256 amount, uint256 penalty);
    event TokenSupported(address indexed token, bool supported);

    constructor() {}

    /**
     * @dev Add or remove supported tokens
     * @param token Token address
     * @param supported Whether token is supported
     */
    function setSupportedToken(address token, bool supported) external onlyOwner {
        supportedTokens[token] = supported;
        emit TokenSupported(token, supported);
    }

    /**
     * @dev Create a new SIP
     * @param token Token address for SIP
     * @param amount Amount per deposit
     * @param frequency Deposit frequency
     * @param maxExecutions Maximum number of executions (0 for unlimited)
     * @param earlyWithdrawalPenalty Penalty for early withdrawal in basis points
     */
    function createSIP(
        address token,
        uint256 amount,
        Frequency frequency,
        uint256 maxExecutions,
        uint256 earlyWithdrawalPenalty
    ) external nonReentrant returns (uint256) {
        require(supportedTokens[token], "Token not supported");
        require(amount > 0, "Amount must be greater than 0");
        require(earlyWithdrawalPenalty <= MAX_PENALTY, "Penalty too high");

        uint256 sipId = nextSIPId++;
        
        sips[sipId] = SIP({
            user: msg.sender,
            token: token,
            amount: amount,
            frequency: frequency,
            startTime: block.timestamp,
            lastExecuted: 0,
            totalDeposits: 0,
            executionCount: 0,
            maxExecutions: maxExecutions,
            status: Status.ACTIVE,
            earlyWithdrawalPenalty: earlyWithdrawalPenalty
        });

        userSIPs[msg.sender].push(sipId);

        emit SIPCreated(sipId, msg.sender, token, amount, frequency);
        return sipId;
    }

    /**
     * @dev Execute SIP deposit (can be called by anyone for gas efficiency)
     * @param sipId SIP identifier
     */
    function executeSIP(uint256 sipId) external nonReentrant {
        SIP storage sip = sips[sipId];
        require(sip.user != address(0), "SIP does not exist");
        require(sip.status == Status.ACTIVE, "SIP not active");
        require(canExecuteSIP(sipId), "SIP not ready for execution");

        // Check if max executions reached
        if (sip.maxExecutions > 0 && sip.executionCount >= sip.maxExecutions) {
            sip.status = Status.COMPLETED;
            return;
        }

        // Transfer tokens from user
        IERC20(sip.token).safeTransferFrom(sip.user, address(this), sip.amount);

        // Update SIP state
        sip.lastExecuted = block.timestamp;
        sip.totalDeposits += sip.amount;
        sip.executionCount++;

        emit SIPExecuted(sipId, sip.user, sip.amount, block.timestamp);
    }

    /**
     * @dev Check if SIP can be executed
     * @param sipId SIP identifier
     */
    function canExecuteSIP(uint256 sipId) public view returns (bool) {
        SIP storage sip = sips[sipId];
        if (sip.status != Status.ACTIVE) return false;
        if (sip.maxExecutions > 0 && sip.executionCount >= sip.maxExecutions) return false;

        uint256 interval = getFrequencyInterval(sip.frequency);
        uint256 nextExecution = sip.lastExecuted == 0 ? sip.startTime : sip.lastExecuted + interval;
        
        return block.timestamp >= nextExecution;
    }

    /**
     * @dev Get frequency interval in seconds
     * @param frequency SIP frequency
     */
    function getFrequencyInterval(Frequency frequency) public pure returns (uint256) {
        if (frequency == Frequency.DAILY) return 1 days;
        if (frequency == Frequency.WEEKLY) return 7 days;
        if (frequency == Frequency.MONTHLY) return 30 days;
        return 0;
    }

    /**
     * @dev Pause SIP
     * @param sipId SIP identifier
     */
    function pauseSIP(uint256 sipId) external {
        SIP storage sip = sips[sipId];
        require(sip.user == msg.sender, "Not SIP owner");
        require(sip.status == Status.ACTIVE, "SIP not active");
        
        sip.status = Status.PAUSED;
        emit SIPPaused(sipId, msg.sender);
    }

    /**
     * @dev Resume SIP
     * @param sipId SIP identifier
     */
    function resumeSIP(uint256 sipId) external {
        SIP storage sip = sips[sipId];
        require(sip.user == msg.sender, "Not SIP owner");
        require(sip.status == Status.PAUSED, "SIP not paused");
        
        sip.status = Status.ACTIVE;
        emit SIPResumed(sipId, msg.sender);
    }

    /**
     * @dev Cancel SIP
     * @param sipId SIP identifier
     */
    function cancelSIP(uint256 sipId) external {
        SIP storage sip = sips[sipId];
        require(sip.user == msg.sender, "Not SIP owner");
        require(sip.status == Status.ACTIVE || sip.status == Status.PAUSED, "Cannot cancel SIP");
        
        sip.status = Status.CANCELLED;
        emit SIPCancelled(sipId, msg.sender);
    }

    /**
     * @dev Early withdrawal with penalty
     * @param sipId SIP identifier
     * @param amount Amount to withdraw
     */
    function earlyWithdrawal(uint256 sipId, uint256 amount) external nonReentrant {
        SIP storage sip = sips[sipId];
        require(sip.user == msg.sender, "Not SIP owner");
        require(amount <= sip.totalDeposits, "Insufficient balance");

        uint256 penalty = (amount * sip.earlyWithdrawalPenalty) / BASIS_POINTS;
        uint256 withdrawAmount = amount - penalty;

        sip.totalDeposits -= amount;

        // Transfer withdrawal amount to user
        IERC20(sip.token).safeTransfer(msg.sender, withdrawAmount);
        
        // Keep penalty in contract (can be used for protocol fees)
        
        emit EarlyWithdrawal(sipId, msg.sender, withdrawAmount, penalty);
    }

    /**
     * @dev Get user's SIPs
     * @param user User address
     */
    function getUserSIPs(address user) external view returns (uint256[] memory) {
        return userSIPs[user];
    }

    /**
     * @dev Get SIP details
     * @param sipId SIP identifier
     */
    function getSIP(uint256 sipId) external view returns (SIP memory) {
        return sips[sipId];
    }

    /**
     * @dev Emergency withdrawal function (only owner)
     * @param token Token address
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        IERC20(token).safeTransfer(owner(), amount);
    }
}
