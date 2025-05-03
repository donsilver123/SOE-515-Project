// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {USDC} from "../src/USDC.sol";

contract CounterScript is Script {
    function run() public {
        vm.startBroadcast();

        new USDC();

        vm.stopBroadcast();
    }
}
