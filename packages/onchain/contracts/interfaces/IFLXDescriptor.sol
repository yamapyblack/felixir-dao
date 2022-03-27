// SPDX-License-Identifier: CC0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

interface IFLXDescriptor {
    function getSeedAndPulettesByTokenId(uint256 _tokenId)
        external
        view
        returns (bytes memory, string[] memory);
}
