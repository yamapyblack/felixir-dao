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

    function junction(uint parentTokenId, IERC721Junction.ChildToken memory childToken, address junctioner) override external {
        require(
            IERC721(childToken.addr).isApprovedForAll(msg.sender, address(this)),
            "ERC721Junction: not approved"
        );

        IERC721(childToken.addr).transferFrom(
            junctioner,
            address(this),
            childToken.id
        );

        junctions[parentTokenId].push(childToken);

        emit Junction(
            junctioner,
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
