// SPDX-License-Identifier: CC0

pragma solidity ^0.8.0;

import "../nft/ERC721Primitive.sol";

contract ERC721PrimitiveMock is ERC721Primitive {
    constructor() ERC721Primitive("Mock", "MOCK") {}
}
