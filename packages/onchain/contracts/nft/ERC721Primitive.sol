// SPDX-License-Identifier: CC0

pragma solidity ^0.8.0;

import "../lib/ERC721Mintable.sol";
import "../interfaces/ITokenDescriptor.sol";
// import "../lib/ERC721Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract ERC721Primitive is ERC721Mintable, Ownable {
    address public descriptor;

    constructor(string memory name, string memory symbol) ERC721Mintable(name, symbol) {}

    function setDescriptor(address _descriptor) external onlyOwner {
        descriptor = _descriptor;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_exists(tokenId), "nonexistent token");
        return ITokenDescriptor(descriptor).tokenURI(this, tokenId);
    }

}
