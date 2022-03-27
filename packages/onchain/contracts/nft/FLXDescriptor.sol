// SPDX-License-Identifier: CC0

pragma solidity 0.8.13;

import "@openzeppelin/contracts/utils/Strings.sol";
import '../lib/ERC721TokenDescriptor.sol';
import "../interfaces/IERC721TokenDescriptor.sol";
import "../interfaces/IERC721FullyOnchain.sol";
import "../interfaces/IFLXDescriptor.sol";
import "../interfaces/IERC721Junction.sol";
import '../lib/PaletteStorage.sol';
import { Base64 } from '@openzeppelin/contracts/utils/Base64.sol';
import { MultiPartRLEToSVG } from '../lib/MultiPartRLEToSVG.sol';

contract FLXDescriptor is ERC721TokenDescriptor, IFLXDescriptor, PaletteStorage {
    using Strings for uint256;

    constructor() {}

    // TODO yamaura
    function getSeedAndPulettesByTokenId(uint _tokenId) override public view returns(bytes memory, string[] memory) {
        return (seeds[0], palettes[0]);
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

    // TODO yamaura
    function generateAttributes(address token, uint256 tokenId)
        public
        pure
        returns (string memory)
    {
        string[3] memory attributes = ["hp", "at", "df"];
        string[3] memory values = ["hoge","fuga","weiwei"];

        return _buildAttributes(attributes, values);
    }

    function generateImage(address token, uint256 tokenId)
        public
        view
        returns (string memory)
    {
        // svg header
        string memory ret = '<svg width="320" height="320" viewBox="0 0 320 320" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">';

        (bytes memory seed, string[] memory palette) = getSeedAndPulettesByTokenId(tokenId);
        ret = string(
            abi.encodePacked(
                ret,
                MultiPartRLEToSVG.generateSVGRects(seed, palette)
            )
        );

        // TODO yamaura
        IERC721Junction.ChildToken[] memory children = IERC721Junction(token).getJunctions(tokenId);
        for(uint8 i = 0; i < children.length; i++){
            (bytes memory seedExt, string[] memory paletteExt) = IFLXDescriptor(
                IERC721FullyOnchain(children[i].addr).descriptor())
                .getSeedAndPulettesByTokenId(children[i].id);
            ret = string(
                abi.encodePacked(
                    ret,
                    MultiPartRLEToSVG.generateSVGRects(seedExt, paletteExt)
                )
            );
        }

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

    function tokenURI(address token, uint256 tokenId)
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
                                generateAttributes(token, tokenId),
                                '], "image": "data:image/svg+xml;base64,',
                                generateImage(token, tokenId),
                                '"}'
                            )
                        )
                    )
                )
            );
    }

}
