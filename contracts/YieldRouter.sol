// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/**
 * @title YieldRouter
 * @dev Routes funds to optimal yield-generating protocols on Somnia
 * @notice Dynamically allocates funds across DeFi pools for maximum APY
 */
contract YieldRouter is ReentrancyGuard, Ownable {
    using SafeERC20 for IERC20;

    struct Pool {
        address poolAddress;
        address token;
        uint256 currentAPY; // Basis points (100 = 1%)
        uint256 tvl; // Total Value Locked
        uint256 maxCapacity;
        bool isActive;
        uint256 riskScore; // 1-10 (1 = lowest risk)
    }

    struct UserPosition {
        uint256 totalDeposited;
        uint256 yieldEarned;
        uint256 lastUpdateTime;
        mapping(uint256 => uint256) poolAllocations; // poolId => amount
    }

    // State variables
    mapping(uint256 => Pool) public pools;
    mapping(address => UserPosition) public userPositions;
    mapping(address => uint256[]) public userActivePools;
    
    uint256 public nextPoolId = 1;
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public constant MAX_RISK_SCORE = 10;
    uint256 public rebalanceThreshold = 100; // 1% APY difference to trigger rebalance
    
    // Events
    event PoolAdded(uint256 indexed poolId, address indexed poolAddress, address indexed token);
    event PoolUpdated(uint256 indexed poolId, uint256 newAPY, uint256 newTVL);
    event FundsDeposited(address indexed user, uint256 amount, address indexed token);
    event FundsWithdrawn(address indexed user, uint256 amount, address indexed token);
    event YieldHarvested(address indexed user, uint256 amount, address indexed token);
    event Rebalanced(address indexed user, uint256[] oldAllocations, uint256[] newAllocations);

    constructor() {}

    /**
     * @dev Add a new yield pool
     * @param poolAddress Address of the yield pool
     * @param token Token address
     * @param initialAPY Initial APY in basis points
     * @param maxCapacity Maximum capacity of the pool
     * @param riskScore Risk score (1-10)
     */
    function addPool(
        address poolAddress,
        address token,
        uint256 initialAPY,
        uint256 maxCapacity,
        uint256 riskScore
    ) external onlyOwner {
        require(poolAddress != address(0), "Invalid pool address");
        require(token != address(0), "Invalid token address");
        require(riskScore <= MAX_RISK_SCORE && riskScore > 0, "Invalid risk score");

        uint256 poolId = nextPoolId++;
        
        pools[poolId] = Pool({
            poolAddress: poolAddress,
            token: token,
            currentAPY: initialAPY,
            tvl: 0,
            maxCapacity: maxCapacity,
            isActive: true,
            riskScore: riskScore
        });

        emit PoolAdded(poolId, poolAddress, token);
    }

    /**
     * @dev Update pool information
     * @param poolId Pool identifier
     * @param newAPY New APY in basis points
     * @param newTVL New TVL
     */
    function updatePool(uint256 poolId, uint256 newAPY, uint256 newTVL) external onlyOwner {
        require(pools[poolId].poolAddress != address(0), "Pool does not exist");
        
        pools[poolId].currentAPY = newAPY;
        pools[poolId].tvl = newTVL;
        
        emit PoolUpdated(poolId, newAPY, newTVL);
    }

    /**
     * @dev Deposit funds and route to optimal pools
     * @param token Token address
     * @param amount Amount to deposit
     * @param maxRiskScore Maximum acceptable risk score
     */
    function deposit(address token, uint256 amount, uint256 maxRiskScore) external nonReentrant {
        require(amount > 0, "Amount must be greater than 0");
        require(maxRiskScore <= MAX_RISK_SCORE && maxRiskScore > 0, "Invalid risk score");

        // Transfer tokens from user
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);

        // Update user position
        UserPosition storage position = userPositions[msg.sender];
        position.totalDeposited += amount;
        position.lastUpdateTime = block.timestamp;

        // Route funds to optimal pools
        _routeFunds(msg.sender, token, amount, maxRiskScore);

        emit FundsDeposited(msg.sender, amount, token);
    }

    /**
     * @dev Withdraw funds from pools
     * @param token Token address
     * @param amount Amount to withdraw
     */
    function withdraw(address token, uint256 amount) external nonReentrant {
        UserPosition storage position = userPositions[msg.sender];
        require(position.totalDeposited >= amount, "Insufficient balance");

        // Harvest yield before withdrawal
        _harvestYield(msg.sender, token);

        // Withdraw from pools
        _withdrawFromPools(msg.sender, token, amount);

        // Update user position
        position.totalDeposited -= amount;
        position.lastUpdateTime = block.timestamp;

        // Transfer tokens to user
        IERC20(token).safeTransfer(msg.sender, amount);

        emit FundsWithdrawn(msg.sender, amount, token);
    }

    /**
     * @dev Harvest yield from all pools
     * @param token Token address
     */
    function harvestYield(address token) external nonReentrant {
        uint256 yieldAmount = _harvestYield(msg.sender, token);
        require(yieldAmount > 0, "No yield to harvest");

        // Transfer yield to user
        IERC20(token).safeTransfer(msg.sender, yieldAmount);

        emit YieldHarvested(msg.sender, yieldAmount, token);
    }

    /**
     * @dev Rebalance user's portfolio for optimal yield
     * @param token Token address
     * @param maxRiskScore Maximum acceptable risk score
     */
    function rebalance(address token, uint256 maxRiskScore) external nonReentrant {
        UserPosition storage position = userPositions[msg.sender];
        require(position.totalDeposited > 0, "No funds to rebalance");

        // Get current allocations
        uint256[] memory currentAllocations = _getCurrentAllocations(msg.sender);
        
        // Calculate optimal allocations
        uint256[] memory optimalAllocations = _calculateOptimalAllocations(
            token, 
            position.totalDeposited, 
            maxRiskScore
        );

        // Check if rebalancing is needed
        if (_shouldRebalance(currentAllocations, optimalAllocations)) {
            _executeRebalance(msg.sender, token, optimalAllocations);
            emit Rebalanced(msg.sender, currentAllocations, optimalAllocations);
        }
    }

    /**
     * @dev Get optimal pools for a token with risk constraint
     * @param token Token address
     * @param maxRiskScore Maximum acceptable risk score
     */
    function getOptimalPools(address token, uint256 maxRiskScore) 
        external 
        view 
        returns (uint256[] memory poolIds, uint256[] memory apys) 
    {
        uint256 count = 0;
        
        // Count eligible pools
        for (uint256 i = 1; i < nextPoolId; i++) {
            Pool storage pool = pools[i];
            if (pool.isActive && pool.token == token && pool.riskScore <= maxRiskScore) {
                count++;
            }
        }

        poolIds = new uint256[](count);
        apys = new uint256[](count);
        uint256 index = 0;

        // Populate arrays and sort by APY (descending)
        for (uint256 i = 1; i < nextPoolId; i++) {
            Pool storage pool = pools[i];
            if (pool.isActive && pool.token == token && pool.riskScore <= maxRiskScore) {
                poolIds[index] = i;
                apys[index] = pool.currentAPY;
                index++;
            }
        }

        // Simple bubble sort by APY (descending)
        for (uint256 i = 0; i < count - 1; i++) {
            for (uint256 j = 0; j < count - i - 1; j++) {
                if (apys[j] < apys[j + 1]) {
                    // Swap APYs
                    uint256 tempAPY = apys[j];
                    apys[j] = apys[j + 1];
                    apys[j + 1] = tempAPY;
                    
                    // Swap pool IDs
                    uint256 tempId = poolIds[j];
                    poolIds[j] = poolIds[j + 1];
                    poolIds[j + 1] = tempId;
                }
            }
        }

        return (poolIds, apys);
    }

    /**
     * @dev Get user's current yield
     * @param user User address
     * @param token Token address
     */
    function getCurrentYield(address user, address token) external view returns (uint256) {
        UserPosition storage position = userPositions[user];
        if (position.totalDeposited == 0) return 0;

        uint256 totalYield = 0;
        uint256 timeDiff = block.timestamp - position.lastUpdateTime;

        for (uint256 i = 1; i < nextPoolId; i++) {
            uint256 allocation = position.poolAllocations[i];
            if (allocation > 0 && pools[i].token == token) {
                uint256 poolYield = (allocation * pools[i].currentAPY * timeDiff) / 
                                   (BASIS_POINTS * 365 days);
                totalYield += poolYield;
            }
        }

        return totalYield;
    }

    // Internal functions

    function _routeFunds(address user, address token, uint256 amount, uint256 maxRiskScore) internal {
        (uint256[] memory poolIds, uint256[] memory apys) = this.getOptimalPools(token, maxRiskScore);
        
        if (poolIds.length == 0) return;

        // Simple strategy: allocate to highest APY pool with available capacity
        for (uint256 i = 0; i < poolIds.length; i++) {
            Pool storage pool = pools[poolIds[i]];
            uint256 availableCapacity = pool.maxCapacity - pool.tvl;
            
            if (availableCapacity >= amount) {
                userPositions[user].poolAllocations[poolIds[i]] += amount;
                pool.tvl += amount;
                break;
            } else if (availableCapacity > 0) {
                userPositions[user].poolAllocations[poolIds[i]] += availableCapacity;
                pool.tvl += availableCapacity;
                amount -= availableCapacity;
            }
        }
    }

    function _harvestYield(address user, address token) internal returns (uint256) {
        UserPosition storage position = userPositions[user];
        uint256 yieldAmount = this.getCurrentYield(user, token);
        
        position.yieldEarned += yieldAmount;
        position.lastUpdateTime = block.timestamp;
        
        return yieldAmount;
    }

    function _withdrawFromPools(address user, address token, uint256 amount) internal {
        UserPosition storage position = userPositions[user];
        uint256 remainingAmount = amount;

        // Withdraw proportionally from all pools
        for (uint256 i = 1; i < nextPoolId && remainingAmount > 0; i++) {
            uint256 allocation = position.poolAllocations[i];
            if (allocation > 0 && pools[i].token == token) {
                uint256 withdrawAmount = (allocation * amount) / position.totalDeposited;
                if (withdrawAmount > remainingAmount) {
                    withdrawAmount = remainingAmount;
                }
                
                position.poolAllocations[i] -= withdrawAmount;
                pools[i].tvl -= withdrawAmount;
                remainingAmount -= withdrawAmount;
            }
        }
    }

    function _getCurrentAllocations(address user) internal view returns (uint256[] memory) {
        uint256[] memory allocations = new uint256[](nextPoolId);
        UserPosition storage position = userPositions[user];
        
        for (uint256 i = 1; i < nextPoolId; i++) {
            allocations[i] = position.poolAllocations[i];
        }
        
        return allocations;
    }

    function _calculateOptimalAllocations(
        address token, 
        uint256 totalAmount, 
        uint256 maxRiskScore
    ) internal view returns (uint256[] memory) {
        (uint256[] memory poolIds, ) = this.getOptimalPools(token, maxRiskScore);
        uint256[] memory allocations = new uint256[](nextPoolId);
        
        // Simple strategy: allocate to highest APY pools with available capacity
        uint256 remainingAmount = totalAmount;
        
        for (uint256 i = 0; i < poolIds.length && remainingAmount > 0; i++) {
            Pool storage pool = pools[poolIds[i]];
            uint256 availableCapacity = pool.maxCapacity - pool.tvl;
            
            if (availableCapacity >= remainingAmount) {
                allocations[poolIds[i]] = remainingAmount;
                remainingAmount = 0;
            } else if (availableCapacity > 0) {
                allocations[poolIds[i]] = availableCapacity;
                remainingAmount -= availableCapacity;
            }
        }
        
        return allocations;
    }

    function _shouldRebalance(
        uint256[] memory current, 
        uint256[] memory optimal
    ) internal view returns (bool) {
        for (uint256 i = 1; i < current.length; i++) {
            if (current[i] != optimal[i]) {
                return true;
            }
        }
        return false;
    }

    function _executeRebalance(
        address user, 
        address token, 
        uint256[] memory newAllocations
    ) internal {
        UserPosition storage position = userPositions[user];
        
        // Reset current allocations
        for (uint256 i = 1; i < nextPoolId; i++) {
            uint256 currentAllocation = position.poolAllocations[i];
            if (currentAllocation > 0) {
                pools[i].tvl -= currentAllocation;
                position.poolAllocations[i] = 0;
            }
        }
        
        // Apply new allocations
        for (uint256 i = 1; i < newAllocations.length; i++) {
            if (newAllocations[i] > 0) {
                position.poolAllocations[i] = newAllocations[i];
                pools[i].tvl += newAllocations[i];
            }
        }
    }

    /**
     * @dev Set rebalance threshold
     * @param newThreshold New threshold in basis points
     */
    function setRebalanceThreshold(uint256 newThreshold) external onlyOwner {
        rebalanceThreshold = newThreshold;
    }

    /**
     * @dev Toggle pool active status
     * @param poolId Pool identifier
     * @param isActive New active status
     */
    function setPoolActive(uint256 poolId, bool isActive) external onlyOwner {
        require(pools[poolId].poolAddress != address(0), "Pool does not exist");
        pools[poolId].isActive = isActive;
    }
}
