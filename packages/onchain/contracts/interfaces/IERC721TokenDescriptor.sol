// SPDX-License-Identifier: CC0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IERC721TokenDescriptor {
    function tokenURI(address token, uint256 tokenId)
        external
        view
        returns (string memory);

    function generateName(uint256 tokenId)
        external
        view
        returns (string memory);

    function generateDescription(uint256 tokenId)
        external
        view
        returns (string memory);

    function generateAttributes(uint256 tokenId)
        external
        pure
        returns (string memory);

    function generateImage(uint256 tokenId)
        external
        view
        returns (string memory);

}
