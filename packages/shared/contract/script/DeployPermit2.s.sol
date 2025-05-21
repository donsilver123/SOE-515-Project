// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import {Script, console} from "forge-std/Script.sol";
import {Permit2} from "permit2/Permit2.sol";

contract DeployPermit2 is Script {
    function run() public {
        vm.startBroadcast();

        new Permit2();

        vm.stopBroadcast();
    }
}
