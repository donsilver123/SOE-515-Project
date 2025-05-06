// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {PlatformUSDC} from "../src/PlatformUSDC.sol";

contract DeployPlatformUSDCScript is Script {
    function run() public {
        vm.startBroadcast();

        new PlatformUSDC();

        vm.stopBroadcast();
    }
}
