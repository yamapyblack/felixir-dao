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
    function bulkJunction(uint[] calldata parentTokenId, ChildToken[] calldata childToken) external;
    function junction(uint parentTokenId, ChildToken memory childToken) external;
    function unJunction(uint parentTokenId) external;
}
