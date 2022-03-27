// SPDX-License-Identifier: CC0

pragma solidity ^0.8.0;

import "../lib/ERC721Mintable.sol";
import "../lib/ERC721Junction.sol";
import "../interfaces/ITokenDescriptor.sol";
// import "../lib/ERC721Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

abstract contract ERC721Primitive is ERC721Mintable, ERC721Junction, Ownable {
    address public descriptor;

    constructor(string memory name, string memory symbol) ERC721Mintable(name, symbol) {}

    function setDescriptor(address _descriptor) external onlyOwner {
        descriptor = _descriptor;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        require(_exists(tokenId), "nonexistent token");
        return ITokenDescriptor(descriptor).tokenURI(this, tokenId);
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

    //
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override(ERC721Mintable, ERC721) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

}
