// SPDX-License-Identifier: CC0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract ERC721Mock is ERC721 {
    constructor() ERC721("ERC721Mock", "ERC721MOCK") {}
    function mint(address to, uint256 tokenId)
        external
    {
        super._mint(to, tokenId);
    }
}
