// SPDX-License-Identifier: CC0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../interfaces/IERC721Junction.sol";

abstract contract ERC721Junction is IERC721Junction, ERC721 {
    /** mapping parentTokenId => ChildToken[] */ 
    mapping(uint256 => IERC721Junction.ChildToken[]) children;

    function getChildren(uint256 parentTokenId)
        external
        view
        override
        returns (ChildToken[] memory)
    {
        return children[parentTokenId];
    }

    function junction(
        uint256 parentTokenId,
        ChildToken[] calldata childrenToken
    ) public override {
        require(
            msg.sender == ownerOf(parentTokenId),
            "ERC721Junction: junction by only parent tokens owner"
        );

        for (uint8 i = 0; i < childrenToken.length; i++) {
            require(
                msg.sender == IERC721(childrenToken[i].addr).ownerOf(childrenToken[i].id),
                "ERC721Junction: junction by only child tokens owner"
            );
            require(
                IERC721(childrenToken[i].addr).isApprovedForAll(
                    msg.sender,
                    address(this)
                ),
                "ERC721Junction: not approved"
            );

            IERC721(childrenToken[i].addr).transferFrom(
                msg.sender,
                address(this),
                childrenToken[i].id
            );

            children[parentTokenId].push(childrenToken[i]);

            emit Junction(msg.sender, parentTokenId, childrenToken[i]);
        }
    }

    function unJunction(uint256 parentTokenId) external override {
        require(
            msg.sender == ownerOf(parentTokenId),
            "ERC721Junction: unJunction by only parent tokens owner"
        );

        IERC721Junction.ChildToken[] storage childTokens = children[
            parentTokenId
        ];

        IERC721(childTokens[childTokens.length - 1].addr).safeTransferFrom(
            address(this),
            msg.sender,
            childTokens[childTokens.length - 1].id
        );

        childTokens.pop();
    }

    function unJunctionAll(uint256 parentTokenId) public override {
        require(
            msg.sender == ownerOf(parentTokenId),
            "ERC721Junction: unJunction by only parent tokens owner"
        );

        IERC721Junction.ChildToken[] memory childTokens = children[
            parentTokenId
        ];
        for (uint8 i = 0; i < childTokens.length; i++) {
            IERC721(childTokens[i].addr).safeTransferFrom(
                address(this),
                msg.sender,
                childTokens[i].id
            );
        }
        delete children[parentTokenId];
    }

    function reJunction(
        uint256 parentTokenId,
        ChildToken[] calldata childToken
    ) external override {
        unJunctionAll(parentTokenId);
        junction(parentTokenId, childToken);
    }

}
