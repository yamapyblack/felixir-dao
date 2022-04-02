// SPDX-License-Identifier: CC0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "../interfaces/IERC721Mintable.sol";

abstract contract ERC721Mintable is
    IERC721Mintable,
    ERC721Enumerable,
    AccessControlEnumerable
{
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor(string memory name_, string memory symbol_)
        ERC721(name_, symbol_)
    {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(MINTER_ROLE, _msgSender());
    }

    function exists(uint256 _tokenId) external view override returns (bool) {
        return super._exists(_tokenId);
    }

    function mint(address to, uint256 tokenId)
        public
        override
        onlyRole(MINTER_ROLE)
    {
        super._mint(to, tokenId);
    }

    function mint(address[] memory _toList, uint256[] memory _tokenIdList)
        external
        override
        onlyRole(MINTER_ROLE)
    {
        require(
            _toList.length == _tokenIdList.length,
            "input length must be same"
        );
        for (uint8 i = 0; i < _tokenIdList.length; i++) {
            super._mint(_toList[i], _tokenIdList[i]);
        }
    }

    function burn(uint256 tokenId) external virtual {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721Burnable: caller is not owner nor approved"
        );
        _burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(AccessControlEnumerable, ERC721Enumerable, IERC165)
        returns (bool)
    {
        return
            AccessControlEnumerable.supportsInterface(interfaceId) ||
            ERC721.supportsInterface(interfaceId);
    }

}
