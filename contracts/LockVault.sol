// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title LockVault
 * @dev Emergency fund locking mechanism with multi-sig governance
 * @notice Allows users to lock funds with emergency unlock capabilities
 */
contract LockVault is ReentrancyGuard, AccessControl {
    using SafeERC20 for IERC20;

    bytes32 public constant EMERGENCY_ROLE = keccak256("EMERGENCY_ROLE");
    bytes32 public constant GOVERNANCE_ROLE = keccak256("GOVERNANCE_ROLE");

    enum LockStatus { ACTIVE, EMERGENCY_UNLOCKED, WITHDRAWN }

    struct Lock {
        address user;
        address token;
        uint256 amount;
        uint256 lockTime;
        uint256 unlockTime;
        LockStatus status;
        string reason; // Reason for locking
    }

    struct EmergencyProposal {
        uint256 lockId;
        address proposer;
        string reason;
        uint256 proposalTime;
        uint256 approvals;
        uint256 rejections;
        bool executed;
        mapping(address => bool) hasVoted;
    }

    // State variables
    mapping(uint256 => Lock) public locks;
    mapping(address => uint256[]) public userLocks;
    mapping(uint256 => EmergencyProposal) public emergencyProposals;
    
    uint256 public nextLockId = 1;
    uint256 public nextProposalId = 1;
    uint256 public requiredApprovals = 3; // Minimum approvals for emergency unlock
    uint256 public proposalTimeout = 7 days; // Proposal voting period
    
    // Events
    event FundsLocked(
        uint256 indexed lockId,
        address indexed user,
        address indexed token,
        uint256 amount,
        uint256 unlockTime,
        string reason
    );
    
    event EmergencyProposalCreated(
        uint256 indexed proposalId,
        uint256 indexed lockId,
        address indexed proposer,
        string reason
    );
    
    event EmergencyProposalVoted(
        uint256 indexed proposalId,
        address indexed voter,
        bool approved
    );
    
    event EmergencyUnlockExecuted(
        uint256 indexed proposalId,
        uint256 indexed lockId,
        address indexed user
    );
    
    event FundsWithdrawn(
        uint256 indexed lockId,
        address indexed user,
        uint256 amount
    );

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(GOVERNANCE_ROLE, msg.sender);
        _grantRole(EMERGENCY_ROLE, msg.sender);
    }

    /**
     * @dev Lock funds for emergency purposes
     * @param token Token address
     * @param amount Amount to lock
     * @param lockDuration Duration in seconds
     * @param reason Reason for locking
     */
    function lockFunds(
        address token,
        uint256 amount,
        uint256 lockDuration,
        string calldata reason
    ) external nonReentrant returns (uint256) {
        require(amount > 0, "Amount must be greater than 0");
        require(lockDuration > 0, "Lock duration must be greater than 0");
        require(bytes(reason).length > 0, "Reason required");

        // Transfer tokens from user
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        uint256 lockId = nextLockId++;
        uint256 unlockTime = block.timestamp + lockDuration;

        locks[lockId] = Lock({
            user: msg.sender,
            token: token,
            amount: amount,
            lockTime: block.timestamp,
            unlockTime: unlockTime,
            status: LockStatus.ACTIVE,
            reason: reason
        });

        userLocks[msg.sender].push(lockId);

        emit FundsLocked(lockId, msg.sender, token, amount, unlockTime, reason);
        return lockId;
    }

    /**
     * @dev Withdraw funds after unlock time
     * @param lockId Lock identifier
     */
    function withdrawFunds(uint256 lockId) external nonReentrant {
        Lock storage lock = locks[lockId];
        require(lock.user == msg.sender, "Not lock owner");
        require(lock.status == LockStatus.ACTIVE, "Lock not active");
        require(block.timestamp >= lock.unlockTime, "Lock period not expired");

        lock.status = LockStatus.WITHDRAWN;

        // Transfer tokens back to user
        IERC20(lock.token).safeTransfer(msg.sender, lock.amount);

        emit FundsWithdrawn(lockId, msg.sender, lock.amount);
    }

    /**
     * @dev Create emergency unlock proposal
     * @param lockId Lock identifier
     * @param reason Reason for emergency unlock
     */
    function createEmergencyProposal(
        uint256 lockId,
        string calldata reason
    ) external onlyRole(EMERGENCY_ROLE) returns (uint256) {
        require(locks[lockId].user != address(0), "Lock does not exist");
        require(locks[lockId].status == LockStatus.ACTIVE, "Lock not active");
        require(bytes(reason).length > 0, "Reason required");

        uint256 proposalId = nextProposalId++;

        EmergencyProposal storage proposal = emergencyProposals[proposalId];
        proposal.lockId = lockId;
        proposal.proposer = msg.sender;
        proposal.reason = reason;
        proposal.proposalTime = block.timestamp;
        proposal.approvals = 0;
        proposal.rejections = 0;
        proposal.executed = false;

        emit EmergencyProposalCreated(proposalId, lockId, msg.sender, reason);
        return proposalId;
    }

    /**
     * @dev Vote on emergency proposal
     * @param proposalId Proposal identifier
     * @param approve Whether to approve the proposal
     */
    function voteOnEmergencyProposal(
        uint256 proposalId,
        bool approve
    ) external onlyRole(GOVERNANCE_ROLE) {
        EmergencyProposal storage proposal = emergencyProposals[proposalId];
        require(proposal.proposer != address(0), "Proposal does not exist");
        require(!proposal.executed, "Proposal already executed");
        require(
            block.timestamp <= proposal.proposalTime + proposalTimeout,
            "Proposal expired"
        );
        require(!proposal.hasVoted[msg.sender], "Already voted");

        proposal.hasVoted[msg.sender] = true;

        if (approve) {
            proposal.approvals++;
        } else {
            proposal.rejections++;
        }

        emit EmergencyProposalVoted(proposalId, msg.sender, approve);

        // Auto-execute if enough approvals
        if (proposal.approvals >= requiredApprovals) {
            _executeEmergencyUnlock(proposalId);
        }
    }

    /**
     * @dev Execute emergency unlock
     * @param proposalId Proposal identifier
     */
    function executeEmergencyUnlock(uint256 proposalId) external onlyRole(EMERGENCY_ROLE) {
        EmergencyProposal storage proposal = emergencyProposals[proposalId];
        require(proposal.approvals >= requiredApprovals, "Insufficient approvals");
        require(!proposal.executed, "Already executed");

        _executeEmergencyUnlock(proposalId);
    }

    /**
     * @dev Internal function to execute emergency unlock
     * @param proposalId Proposal identifier
     */
    function _executeEmergencyUnlock(uint256 proposalId) internal {
        EmergencyProposal storage proposal = emergencyProposals[proposalId];
        Lock storage lock = locks[proposal.lockId];

        require(lock.status == LockStatus.ACTIVE, "Lock not active");

        proposal.executed = true;
        lock.status = LockStatus.EMERGENCY_UNLOCKED;

        // Transfer tokens back to user
        IERC20(lock.token).safeTransfer(lock.user, lock.amount);

        emit EmergencyUnlockExecuted(proposalId, proposal.lockId, lock.user);
    }

    /**
     * @dev Get user's locks
     * @param user User address
     */
    function getUserLocks(address user) external view returns (uint256[] memory) {
        return userLocks[user];
    }

    /**
     * @dev Get lock details
     * @param lockId Lock identifier
     */
    function getLock(uint256 lockId) external view returns (Lock memory) {
        return locks[lockId];
    }

    /**
     * @dev Get emergency proposal details
     * @param proposalId Proposal identifier
     */
    function getEmergencyProposal(uint256 proposalId) 
        external 
        view 
        returns (
            uint256 lockId,
            address proposer,
            string memory reason,
            uint256 proposalTime,
            uint256 approvals,
            uint256 rejections,
            bool executed
        ) 
    {
        EmergencyProposal storage proposal = emergencyProposals[proposalId];
        return (
            proposal.lockId,
            proposal.proposer,
            proposal.reason,
            proposal.proposalTime,
            proposal.approvals,
            proposal.rejections,
            proposal.executed
        );
    }

    /**
     * @dev Check if address has voted on proposal
     * @param proposalId Proposal identifier
     * @param voter Voter address
     */
    function hasVoted(uint256 proposalId, address voter) external view returns (bool) {
        return emergencyProposals[proposalId].hasVoted[voter];
    }

    /**
     * @dev Set required approvals for emergency unlock
     * @param newRequiredApprovals New required approvals
     */
    function setRequiredApprovals(uint256 newRequiredApprovals) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newRequiredApprovals > 0, "Must require at least 1 approval");
        requiredApprovals = newRequiredApprovals;
    }

    /**
     * @dev Set proposal timeout
     * @param newTimeout New timeout in seconds
     */
    function setProposalTimeout(uint256 newTimeout) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(newTimeout > 0, "Timeout must be greater than 0");
        proposalTimeout = newTimeout;
    }

    /**
     * @dev Grant emergency role to address
     * @param account Account to grant role
     */
    function grantEmergencyRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(EMERGENCY_ROLE, account);
    }

    /**
     * @dev Grant governance role to address
     * @param account Account to grant role
     */
    function grantGovernanceRole(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(GOVERNANCE_ROLE, account);
    }

    /**
     * @dev Emergency withdrawal function (only admin)
     * @param token Token address
     * @param amount Amount to withdraw
     */
    function emergencyWithdraw(
        address token, 
        uint256 amount
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        IERC20(token).safeTransfer(msg.sender, amount);
    }
}
