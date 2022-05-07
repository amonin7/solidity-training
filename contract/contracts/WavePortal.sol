// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract WavePortal {
    // a "state variable" and it's cool because it's stored permanently in contract storage
    uint256 totalWaves;

    constructor() {
    console.log("Yo yo, I am a contract and I am smart");
    }

    //our functions become available to be called on the blockchain because we used that special public keyword on our function
    function wave() public {
        totalWaves += 1;
        // `msg.sender` - is the wallet address of the person who called the function
        console.log("%s has waved!", msg.sender);
    }

    function getTotalWaves() public view returns (uint256) {
        console.log("We have %d total waves!", totalWaves);
        return totalWaves;
    }
}

