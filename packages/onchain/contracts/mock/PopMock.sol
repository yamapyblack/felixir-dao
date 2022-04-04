// SPDX-License-Identifier: CC0

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract PopMock {

    string[] public arr;

    function push(string memory str)
        external
    {
        arr.push(str);
    }

    function pop()
        external
    {
        arr.pop();
    }

    function list() external view{
        console.log("----------list----------");

        for(uint8 i =0; i < arr.length; i++){
            console.log(arr[i]);
        }
    }

}
