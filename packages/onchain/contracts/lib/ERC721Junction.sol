// SPDX-License-Identifier: CC0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

abstract contract ERC721Junction is ERC721 {

    struct ChildToken{
        address addr;
        uint id;
    }

    event Junction(
        address indexed junctioner,
        uint parentTokenId,
        ChildToken indexed childToken
    );

    // mapping parentTokenId => ChildToken[]
    mapping(uint => ChildToken[]) public junctions;

    function junction(uint parentTokenId, ChildToken memory childToken, address junctioner) external {
        require(
            IERC721(childToken.addr).isApprovedForAll(msg.sender, address(this)),
            "ERC721Junction: not approved"
        );

        IERC721(childToken.addr).transferFrom(
            junctioner,
            address(this),
            childToken.id
        );

        ChildToken[] storage childTokens = junctions[parentTokenId];
        childTokens.push(childToken);

        emit Junction(
            junctioner,
            parentTokenId,
            childToken
        );
    }

    function unJunction(uint parentTokenId) external {
        require(msg.sender == ownerOf(parentTokenId), "ERC721Junction: unJunction by only parent tokens owner");

        ChildToken[] memory childTokens = junctions[parentTokenId];
        for(uint8 i = 0; i < childTokens.length; i++){
            IERC721(childTokens[i].addr).safeTransferFrom(
                address(this),
                msg.sender,
                childTokens[i].id
            );
        }
        delete junctions[parentTokenId];
    }

}
