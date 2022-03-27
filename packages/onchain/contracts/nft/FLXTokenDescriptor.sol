// SPDX-License-Identifier: CC0

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import '../lib/ERC721TokenDescriptor.sol';
import { Base64 } from '@openzeppelin/contracts/utils/Base64.sol';
import { MultiPartRLEToSVG } from '../lib/MultiPartRLEToSVG.sol';

contract FLXTokenDescriptor is Ownable, ERC721TokenDescriptor {
    using Strings for uint256;

    struct SvgParam {
        bytes seed;
        string[] palette;
    }

    mapping(uint8 => string[]) public palettes;
    mapping(uint8 => bytes) public seeds;

    constructor() {}

    function setSeed(uint8 _seedIdx, bytes calldata _seed) external onlyOwner {
        seeds[_seedIdx] = _seed;
    }

    function addBulkColorsToPalette(
        uint8 paletteIndex,
        string[] calldata newColors
    ) external onlyOwner {
        require(
            palettes[paletteIndex].length + newColors.length <= 256,
            "Palettes can only hold 256 colors"
        );
        for (uint256 i = 0; i < newColors.length; i++) {
            _addColorToPalette(paletteIndex, newColors[i]);
        }
    }

    function addColorToPalette(uint8 _paletteIndex, string calldata _color)
        external
        onlyOwner
    {
        require(
            palettes[_paletteIndex].length <= 255,
            "Palettes can only hold 256 colors"
        );
        _addColorToPalette(_paletteIndex, _color);
    }

    function _addColorToPalette(uint8 _paletteIndex, string calldata _color)
        internal
    {
        palettes[_paletteIndex].push(_color);
    }


//TODO yamaura
    function _buildAttributes(
        string[3] memory trait_types,
        string[3] memory values
    ) private pure returns (string memory) {
        string memory ret;

        for (uint8 i = 0; i < values.length; i++) {

            if(i == 0){ //first
                ret = string(
                    abi.encodePacked(
                        '{"trait_type": "',trait_types[i],'","value": "',values[i],'"}'
                    )
                );
            }else{
                ret = string(
                    abi.encodePacked(
                        ret,',','{"trait_type": "',trait_types[i],'","value": "',values[i],'"}'
                    )
                );
            }
        }
        return ret;
    }

    function generateName(uint256 tokenId)
        public
        override
        view
        returns (string memory)
    {
        return
            string(
                abi.encodePacked(
                    name,
                    tokenId.toString()
                )
            );
    }

    function generateAttributes(uint256 tokenId)
        public
        override
        pure
        returns (string memory)
    {
        string[3] memory attributes = ["hp", "at", "df"];
        string[3] memory values = ["hoge","fuga","weiwei"];

        return _buildAttributes(attributes, values);
    }

    function generateImage(uint256 tokenId)
        public
        override
        view
        returns (string memory)
    {
        // svg header
        string memory ret = '<svg width="320" height="320" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">';

        // TODO yamaura
        ret = string(
            abi.encodePacked(
                ret,
                MultiPartRLEToSVG.generateSVGRects(seeds[0], palettes[0])
            )
        );

        // TODO yamaura
        ret = string(
            abi.encodePacked(
                ret,
                '<rect x="150" y="30" width="10" height="10" fill="#f00"/><rect x="160" y="30" width="10" height="10" fill="#0f0"/>',
                '<rect x="150" y="30" width="10" height="10" fill="#f00"/><rect x="160" y="30" width="10" height="10" fill="#00f"/>'
            )
        );

        // svg footer
        // prettier-ignore
        return Base64.encode(bytes(
            string(
                abi.encodePacked(
                    ret,
                    '</svg>'
                )
            )
        ));
    }

}
