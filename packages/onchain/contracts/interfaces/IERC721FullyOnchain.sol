// SPDX-License-Identifier: CC0

pragma solidity ^0.8.0;

interface IERC721FullyOnchain{
    function descriptor() view external returns(address);
    function setDescriptor(address _descriptor) external;
}
