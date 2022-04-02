// SPDX-License-Identifier: CC0

pragma solidity ^0.8.0;

import "./IERC721TokenDescriptor.sol";

interface IFLXDescriptor is IERC721TokenDescriptor{
    function getSeedAndPalettes(uint256 _tokenId)
        external
        view
        returns (bytes memory, string[] memory);

    function generateSVGImage(uint256 _tokenId)
        external
        view
        returns (string memory);
}
