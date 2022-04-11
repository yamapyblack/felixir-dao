// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "../interfaces/IERC721Mintable.sol";

/**
 * @title Felixir Shop
 * @notice contract for NFT Initial sale on April 18th
*/
contract FelixirShop is Ownable, ReentrancyGuard {
    address public immutable felixirs;
    address public immutable treasury;

    uint256 public constant tokenPrice = 1 ether;

    uint16 public constant totalSupply = 8888;
    uint16 public counter = 1;

    bool public isSaleNow;

    constructor (address _felixirs, address _treasury) {
        felixirs = _felixirs;
        treasury = _treasury;
        
        setSale(true);
    }

    /// @notice Users can purchase a token with this function
    function sell() external payable nonReentrant {
        require(isSaleNow, "Sale has been settled");
        require(msg.value == tokenPrice, "SEND MORE ETH");
        require(counter <= totalSupply, "All felixirs have been already sold");

        IERC721Mintable(felixirs).mint(msg.sender, counter);

        (bool success, ) = treasury.call{value: msg.value}("");
        require(success, "Failed to send Ether");

        ++counter;
    }

    /// @notice The contract owner can start or settle the sale
    function setSale(bool _isSaleNow) public onlyOwner {
        require(isSaleNow != _isSaleNow, "The sale has already been started/settled");
        isSaleNow = _isSaleNow;
    }
}

