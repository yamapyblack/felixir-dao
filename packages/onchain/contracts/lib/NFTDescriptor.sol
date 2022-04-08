// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import { Base64 } from '@openzeppelin/contracts/utils/Base64.sol';
import { MultiPartRLEToSVG } from './MultiPartRLEToSVG.sol';

library NFTDescriptor {
    struct TokenURIParams {
        string name;
        string description;
        string attributes;
        string image;
    }

    /**
     * @notice Construct an ERC721 token URI.
     */
    function constructTokenURI(TokenURIParams memory params)
        public
        view
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
                                params.name,
                                '", "description":"',
                                params.description,
                                '", "attributes":[',
                                params.attributes,
                                '], "image": "data:image/svg+xml;base64,',
                                params.image,
                                '"}'
                            )
                        )
                    )
                )
            );
    }

}