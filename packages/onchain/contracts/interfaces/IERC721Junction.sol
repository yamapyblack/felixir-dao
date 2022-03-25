// SPDX-License-Identifier: CC0

pragma solidity ^0.8.0;

interface IERC721Junction{
    struct ChildToken{
        address addr;
        uint id;
    }

    event Junction(
        address indexed junctioner,
        uint parentTokenId,
        ChildToken indexed childToken
    );

    function getJunctions(uint parentTokenId) external view returns(ChildToken[] memory);
    function junction(uint parentTokenId, ChildToken memory childToken, address junctioner) external;
    function unJunction(uint parentTokenId) external;
}
