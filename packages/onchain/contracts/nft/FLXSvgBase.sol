// SPDX-License-Identifier: CC0

pragma solidity ^0.8.0;

library FLXSvgBase {
    function basePixel1() external pure returns(bytes memory){
        return '<rect x="150" y="30" width="10" height="10" fill="#f00"/><rect x="160" y="30" width="10" height="10" fill="#0f0"/>';
    }

}
