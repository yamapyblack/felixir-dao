// SPDX-License-Identifier: CC0

pragma solidity 0.8.13;

import "../interfaces/IERC721FullyOnchain.sol";
import "../interfaces/IERC721Junction.sol";
import "./FLXDescriptor.sol";

contract FLXDescriptorPrimitive is FLXDescriptor {
    IERC721Junction public token;

    constructor() {}

    function setToken(address _token) external onlyOwner {
        token = IERC721Junction(_token);
    }

    // TODO yamaura
    function getSeedAndPalettes(uint256 _tokenId)
        public
        view
        override
        returns (bytes memory, string[] memory)
    {
        return (seeds[0], palettes[0]);
    }

    // TODO yamaura
    // prettier-ignore
    function generateAttributes(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        string[3] memory attributes = ["hp", "at", "df"];
        string[3] memory values = ["hoge", "fuga", "weiwei"];

        string memory ret = "";
        for (uint8 i = 0; i < values.length; i++) {
            if (i > 0) {
                ret = string(
                    abi.encodePacked(ret,",")
                );
            }
            ret = _buildAttributes(ret, attributes[i], values[i], false);
        }

        string memory tmp;
        IERC721Junction.ChildToken[] memory children = token.getJunctions(
            tokenId
        );
        for (uint8 i = 0; i < children.length; i++) {
            tmp = IFLXDescriptor(
                IERC721FullyOnchain(children[i].addr).descriptor()
            ).generateAttributes(children[i].id);
            ret = string(
                abi.encodePacked(ret, ",", tmp)
            );
        }

        return ret;
    }

    function generateSVGImage(uint256 tokenId)
        public
        view
        override
        returns (string memory)
    {
        (bytes memory seed, string[] memory palette) = getSeedAndPalettes(
            tokenId
        );
        string memory ret = string(
            abi.encodePacked(MultiPartRLEToSVG.generateSVGRects(seed, palette))
        );

        // TODO yamaura
        string memory svg;
        IERC721Junction.ChildToken[] memory children = token.getJunctions(
            tokenId
        );
        for (uint8 i = 0; i < children.length; i++) {
            svg = IFLXDescriptor(
                IERC721FullyOnchain(children[i].addr).descriptor()
            ).generateSVGImage(children[i].id);
            ret = string(abi.encodePacked(ret, svg));
        }

        return ret;
    }
}
