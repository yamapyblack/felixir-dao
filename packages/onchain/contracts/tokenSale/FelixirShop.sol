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

    uint16 public counter = 1;

    bool public isSaleNow;

    event SaleStarted(address owner);
    event SaleSettled(address owner);

    constructor (address _felixirs, address _treasury) {
        require(_felixirs != address(0), "_felixirs is empty");
        require(_treasury != address(0), "_treasury is empty");
        felixirs = _felixirs;
        treasury = _treasury;
        
        startSale();
    }

    function sell() external payable nonReentrant {
        require(isSaleNow, "Sale has been settled");
        require(msg.value >= 300 ether, "SEND MORE ETH");
        require(counter <= 8880, "All felixirs have been already sold");

        IERC721Mintable(felixirs).mint(msg.sender, counter);

        (bool success, ) = treasury.call{value: msg.value}("");
        require(success, "Failed to send Ether");

        unchecked {
            ++counter;
        }
    }

    function startSale() public onlyOwner {
        require(!isSaleNow, "Sale has already been started");
        isSaleNow = true;
        emit SaleStarted(msg.sender);
    }

    function settleSale() external onlyOwner {
        require(isSaleNow, "Sale has already been settled");
        isSaleNow = false;
        emit SaleSettled(msg.sender);
    }
}

