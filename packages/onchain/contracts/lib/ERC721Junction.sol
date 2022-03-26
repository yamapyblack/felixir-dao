// SPDX-License-Identifier: CC0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../interfaces/IERC721Junction.sol";

abstract contract ERC721Junction is IERC721Junction, ERC721 {

    // mapping parentTokenId => ChildToken[]
    mapping(uint => IERC721Junction.ChildToken[]) junctions;

    function getJunctions(uint parentTokenId) override external view returns(ChildToken[] memory){
        return junctions[parentTokenId];
    }

    function bulkJunction(uint[] calldata parentTokenId, ChildToken[] calldata childToken) override external{
        require(parentTokenId.length == childToken.length, "ERC721Junction: different length");
        for(uint8 i = 0; i < parentTokenId.length; i++){
            junction(parentTokenId[i], childToken[i]);
        }
    }

    function junction(uint parentTokenId, IERC721Junction.ChildToken memory childToken) override public {
        require(msg.sender == ownerOf(parentTokenId), "ERC721Junction: junction by only parent tokens owner");
        require(msg.sender == IERC721(childToken.addr).ownerOf(childToken.id), "ERC721Junction: junction by only child tokens owner");

        require(
            IERC721(childToken.addr).isApprovedForAll(msg.sender, address(this)),
            "ERC721Junction: not approved"
        );

        IERC721(childToken.addr).transferFrom(
            msg.sender,
            address(this),
            childToken.id
        );

        junctions[parentTokenId].push(childToken);

        emit Junction(
            msg.sender,
            parentTokenId,
            childToken
        );
    }

    function unJunction(uint parentTokenId) override external {
        require(msg.sender == ownerOf(parentTokenId), "ERC721Junction: unJunction by only parent tokens owner");

        IERC721Junction.ChildToken[] memory childTokens = junctions[parentTokenId];
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
