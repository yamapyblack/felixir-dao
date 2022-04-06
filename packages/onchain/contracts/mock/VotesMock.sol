// SPDX-License-Identifier: CC0

pragma solidity ^0.8.0;

import "../governance/Votes.sol";

contract VotesMock is Votes {
    constructor() EIP712("VotesMock", "1"){}

    function _getVotingUnits(address) internal override view virtual returns (uint256){
        return 1;
    }

    function transferVotingUnits(
        address from,
        address to,
        uint256 amount
    ) external {
        _transferVotingUnits(from, to, amount);
    }

    function getTotalSupply() external view returns (uint256) {
        return _getTotalSupply();
    }

}
