// SPDX-License-Identifier: CC0

pragma solidity 0.8.13;

import "../lib/ERC721FullyOnchain.sol";
import "../lib/ERC721Mintable.sol";

contract FLXExtension is ERC721FullyOnchain, ERC721Mintable {
    constructor()
        ERC721Mintable("FLXExtension", "FLXEX")
    {}

    //
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721Mintable, ERC721)
        returns (bool)
    {
        return
            ERC721Mintable.supportsInterface(interfaceId) ||
            ERC721.supportsInterface(interfaceId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721FullyOnchain, ERC721)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

}
