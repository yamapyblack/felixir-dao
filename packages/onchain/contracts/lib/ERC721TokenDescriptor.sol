// SPDX-License-Identifier: CC0

pragma solidity ^0.8.9;

import "../interfaces/ITokenDescriptor.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import "../interfaces/ITokenDescriptor.sol";

abstract contract ERC721TokenDescriptor is ITokenDescriptor, Ownable {
    using Strings for uint256;

    string public name;
    string public description;

    function setName(string memory _name) external onlyOwner {
        name = _name;
    }

    function setDescription(string memory _description) external onlyOwner {
        description = _description;
    }

    function generateName(uint256 tokenId)
        public
        view
        override
        virtual
        returns (string memory)
    {
        return name;
    }

    function generateDescription(uint256 tokenId)
        public
        view
        override
        virtual
        returns (string memory)
    {
        return description;
    }

    function generateAttributes(uint256 tokenId)
        public
        pure
        override
        virtual
        returns (string memory)
    {}

    function generateImage(uint256 tokenId)
        public
        view
        override
        virtual
        returns (string memory)
    {}

    function tokenURI(IERC721 token, uint256 tokenId)
        external
        view
        override
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(
                        bytes(
                            abi.encodePacked(
                                '{"name":"',
                                generateName(tokenId),
                                '", "description":"',
                                generateDescription(tokenId),
                                '", "attributes":[',
                                generateAttributes(tokenId),
                                '], "image": "data:image/svg+xml;base64,',
                                generateImage(tokenId),
                                '"}'
                            )
                        )
                    )
                )
            );
    }
}
