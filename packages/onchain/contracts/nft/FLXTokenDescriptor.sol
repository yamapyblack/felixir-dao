// SPDX-License-Identifier: CC0

pragma solidity ^0.8.9;

import "../interfaces/ITokenDescriptor.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import { Base64 } from '@openzeppelin/contracts/utils/Base64.sol';
import { MultiPartRLEToSVG } from '../lib/MultiPartRLEToSVG.sol';

contract FLXTokenDescriptor is ITokenDescriptor, Ownable {
    using Strings for uint256;

    struct SvgParam {
        bytes seed;
        string[] palette;
    }

    mapping(uint8 => string[]) public palettes;
    mapping(uint8 => bytes) public seeds;

    string _name = "CryptoFrontier Character #";
    string _description = 'CryptoFrontier is the Full On-chained Game by FrontierDAO.\\n\\nFull On-chained Game is the game where all the data of the game is stored on-chain. Not only the NFTs, but also characters status, skills, battle results and even the battle logic are recorded on-chain.\\nhttps://medium.com/@yamapyblack/full-on-chained-game-by-frontierdao-b8e50549811d';

    constructor() {}

    function setName(string memory name) external onlyOwner {_name = name;}
    function setDescription(string memory description) external onlyOwner {_description = description;}

    function addSeed(uint8 _seedIdx, bytes calldata _seed) external onlyOwner {
        seeds[_seedIdx] = _seed;
    }

    /**
     * @notice Add colors to a color palette.
     * @dev This function can only be called by the owner.
     */
    function addBulkColorsToPalette(uint8 paletteIndex, string[] calldata newColors) external onlyOwner {
        require(palettes[paletteIndex].length + newColors.length <= 256, 'Palettes can only hold 256 colors');
        for (uint256 i = 0; i < newColors.length; i++) {
            _addColorToPalette(paletteIndex, newColors[i]);
        }
    }

    /**
     * @notice Add a single color to a color palette.
     * @dev This function can only be called by the owner.
     */
    function addColorToPalette(uint8 _paletteIndex, string calldata _color) external onlyOwner {
        require(palettes[_paletteIndex].length <= 255, 'Palettes can only hold 256 colors');
        _addColorToPalette(_paletteIndex, _color);
    }

    /**
     * @notice Add a single color to a color palette.
     */
    function _addColorToPalette(uint8 _paletteIndex, string calldata _color) internal {
        palettes[_paletteIndex].push(_color);
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
                        ret,'{"trait_type": "',trait_types[i],'","value": "',values[i],'"}'
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

        return string(abi.encodePacked(ret, "]"));
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

    function generateImage(uint256 tokenId)
        public
        view
        returns (string memory)
    {

        string memory ret = '<svg width="320" height="320" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">';

        ret = string(
            abi.encodePacked(
                ret,
        // TODO yamaura
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
                                generateImage(tokenId),
                                '"}'
                            )
                        )
                    )
                )
            );
    }
}
