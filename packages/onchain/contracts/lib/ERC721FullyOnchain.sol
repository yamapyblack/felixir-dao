// SPDX-License-Identifier: CC0

pragma solidity ^0.8.0;

import "../interfaces/IERC721TokenDescriptor.sol";
import "../interfaces/IERC721FullyOnchain.sol";
// import "../lib/ERC721Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

abstract contract ERC721FullyOnchain is ERC721, Ownable, IERC721FullyOnchain {
    address public override descriptor;

    function setDescriptor(address _descriptor) external onlyOwner {
        descriptor = _descriptor;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        virtual
        returns (string memory)
    {
        require(_exists(tokenId), "nonexistent token");
        return IERC721TokenDescriptor(descriptor).tokenURI(tokenId);
    }

}
