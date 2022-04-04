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

    function getChildren(uint parentTokenId) external view returns(ChildToken[] memory);

    function junction(
        uint256 parentTokenId,
        ChildToken[] calldata childToken
    ) external;

    function unJunctionAll(uint256 parentTokenId) external;

    function reJunction(
        uint256 parentTokenId,
        ChildToken[] calldata childToken
    ) external;

    function unJunction(uint256 parentTokenId) external;
}
