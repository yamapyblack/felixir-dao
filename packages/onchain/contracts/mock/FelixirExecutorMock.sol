// SPDX-License-Identifier: CC0

pragma solidity ^0.8.0;

import "../governance/FelixirExecutor.sol";

contract FelixirExecutorMock is FelixirExecutor {
    uint addedTime = 0;

    constructor() FelixirExecutor() {
    }
    
    function getBlockTimestamp() internal override view returns (uint256) {
        uint ret = block.timestamp + addedTime;
        return ret;
    }

    function add10days() external {
        addedTime = 10 days;
    }

    function add15days() external {
        addedTime = 22 days;
    }
}
