// SPDX-License-Identifier: CC0

pragma solidity 0.8.13;

import "./ERC721Primitive.sol";

contract FLXNFT is ERC721Primitive {
    constructor()
        ERC721Primitive("FLXNFT", "FLX")
    {}
}
