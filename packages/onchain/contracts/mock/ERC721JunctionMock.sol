// SPDX-License-Identifier: CC0

pragma solidity ^0.8.0;

import "../lib/ERC721Junction.sol";

contract ERC721JunctionMock is ERC721Junction {
    constructor() ERC721("Mock", "MOCK") {}
    function mint(address to, uint256 tokenId)
        external
    {
        super._mint(to, tokenId);
    }
}
