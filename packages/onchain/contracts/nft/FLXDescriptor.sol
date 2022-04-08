// SPDX-License-Identifier: CC0

pragma solidity 0.8.13;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "../lib/PaletteStorage.sol";
import "../interfaces/IFLXDescriptor.sol";
import {Base64} from "@openzeppelin/contracts/utils/Base64.sol";
import {MultiPartRLEToSVG} from "../lib/MultiPartRLEToSVG.sol";
import {NFTDescriptor} from "../lib/NFTDescriptor.sol";

contract FLXDescriptor is Ownable, IFLXDescriptor, PaletteStorage {
    using Strings for uint256;

    string name;
    string description;

    constructor() {}

    function setName(string memory _name) external onlyOwner {
        name = _name;
    }

    function setDescription(string memory _description) external onlyOwner {
        description = _description;
    }

    // TODO yamaura
    function getSeedAndPalettes(uint256 _tokenId)
        public
        view
        virtual
        override
        returns (bytes memory, string[] memory)
    {
        return (seeds[0], palettes[0]);
    }

    function generateName(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        return string(abi.encodePacked(name, tokenId.toString()));
    }

    function generateDescription(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        return description;
    }

    // prettier-ignore
    function _buildAttributes(
        string memory ret,
        string memory attribute,
        string memory value,
        bool isInt
    ) internal pure virtual returns (string memory) {
        if (isInt) {
            return
                string(
                    abi.encodePacked(ret,'{"trait_type": "',attribute,'","value": ',value,"}")
                );
        } else {
            return
                string(
                    abi.encodePacked(ret,'{"trait_type": "',attribute,'","value": "',value,'"}')
                );
        }
    }

    // TODO yamaura
    function generateAttributes(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        string[3] memory attributes = ["hp", "at", "df"];
        string[3] memory values = ["hoge", "10", "100"];
        bool[3] memory isInts = [false, true, true];

        string memory ret = "";
        for (uint8 i = 0; i < values.length; i++) {
            if (i > 0) {
                ret = string(abi.encodePacked(ret, ","));
            }
            ret = _buildAttributes(ret, attributes[i], values[i], isInts[i]);
        }

        return ret;
    }

    // prettier-ignore
    function generateImage(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        return
            Base64.encode(bytes(
                string(
                    abi.encodePacked(
                        '<svg width="320" height="320" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">',
                        generateSVGImage(tokenId),
                        "</svg>"
                    )
                )
            ));
    }

    function generateSVGImage(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        (bytes memory seed, string[] memory palette) = getSeedAndPalettes(
            tokenId
        );
        return MultiPartRLEToSVG.generateSVGRects(seed, palette);
    }

    function tokenURI(uint256 tokenId)
        external
        view
        override
        returns (string memory)
    {
        NFTDescriptor.TokenURIParams memory params = NFTDescriptor
            .TokenURIParams({
                name: generateName(tokenId),
                description: generateDescription(tokenId),
                attributes: generateAttributes(tokenId),
                image: generateImage(tokenId)
            });
        return NFTDescriptor.constructTokenURI(params);
    }
}
