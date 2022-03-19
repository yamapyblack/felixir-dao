// SPDX-License-Identifier: CC0

pragma solidity ^0.8.0;

import "../lib/ERC721Mintable.sol";
import "../interfaces/ITokenDescriptor.sol";
// import "../lib/ERC721Permit.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ERC721Carrier is ERC721Mintable, Ownable {
    event Deposit(
        address indexed _contract,
        uint _exTokenId,
        uint _pTokenId,
        address indexed _from
    );

    constructor(string memory name, string memory symbol) ERC721Mintable(name, symbol) {}

    function deposit(address _exContract, uint _exTokenId, uint _pTokenId, address _from) external {
        require(
            IERC721(_exContract).isApprovedForAll(msg.sender, address(this)),
            "ERC721Carrier: not approved"
        );

        IERC721(_exContract).transferFrom(
            _from,
            address(this),
            _exTokenId
        );

        emit Deposit(
            _exContract,
            _exTokenId,
            _pTokenId,
            _from
        );
    }

    function withdraw(address _contract, uint _exTokenId, uint _pTokenId) external {
        require(msg.sender == ownerOf(_pTokenId), "ERC721Carrier: withdrawn by only tokens owner");
        IERC721(_contract).safeTransferFrom(
            address(this),
            msg.sender,
            _exTokenId
        );
    }

}
