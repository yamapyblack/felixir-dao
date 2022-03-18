// SPDX-License-Identifier: CC0

pragma solidity ^0.8.9;

import "../interfaces/ITokenDescriptor.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import './FLXSvgBase.sol';

contract FLXTokenDescriptor is ITokenDescriptor, Ownable {
    using Strings for uint256;

    string[6] colorName = ["red","green","yellow","blue","white","black"];

    string _name = "CryptoFrontier Character #";
    string _description = 'CryptoFrontier is the Full On-chained Game by FrontierDAO.\\n\\nFull On-chained Game is the game where all the data of the game is stored on-chain. Not only the NFTs, but also characters status, skills, battle results and even the battle logic are recorded on-chain.\\nhttps://medium.com/@yamapyblack/full-on-chained-game-by-frontierdao-b8e50549811d';

    constructor() {}

    function setName(string memory name) external onlyOwner {
        _name = name;
    }

    function setDescription(string memory description) external onlyOwner {
        _description = description;
    }

    function _generateName(uint256 tokenId)
        internal
        view
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    _name,
                    tokenId.toString()
                )
            );
    }
    
    function _generateDescription(uint256 tokenId)
        internal
        view
        returns (string memory)
    {
        return _description;
    }

    function _generateAttributes(uint256 tokenId)
        internal
        pure
        returns (string memory)
    {
        string[3] memory attributes = ["hp", "at", "df"];
        string[3] memory values = ["hoge","fuga","weiwei"];

        return _buildAttributes(attributes, values);
    }

    function _buildAttributes(
        string[3] memory trait_types,
        string[3] memory values
    ) private pure returns (string memory) {
        string memory ret = "[";

        for (uint8 i = 0; i < values.length; i++) {

            if(i == 0){ //first
                ret = string(
                    abi.encodePacked(
                        ret,
                        '{"trait_type": "',
                        trait_types[i],
                        '","value": "',
                        values[i],
                        '"}'
                    )
                );
            }else{
                ret = string(
                    abi.encodePacked(
                        ret,
                        ',',
                        '{"trait_type": "',
                        trait_types[i],
                        '","value": "',
                        values[i],
                        '"}'
                    )
                );
            }
        }

        return string(abi.encodePacked(ret, "]"));
    }

    function _generateImage(uint256 tokenId)
        internal
        view
        returns (string memory)
    {
        return
            Base64.encode(
                bytes(
                    abi.encodePacked(
                        '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 320 320">',
                        "<style>",
                        "</style>",
                        FLXSvgBase.basePixel1(),
                        "</svg>"
                    )
                )
            );
    }


    function tokenURI(IERC721 token, uint256 tokenId)
        public
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
                                _generateName(tokenId),
                                '", "description":"',
                                _generateDescription(tokenId),
                                '", "attributes":',
                                _generateAttributes(tokenId),
                                ', "image": "data:image/svg+xml;base64,',
                                _generateImage(tokenId),
                                '"}'
                            )
                        )
                    )
                )
            );
    }
}
