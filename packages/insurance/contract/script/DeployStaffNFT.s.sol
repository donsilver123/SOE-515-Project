// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {StaffNFT} from "../src/StaffNFT.sol";

contract DeployStaffNFTScript is Script {
    function run(string memory _serverBaseUrl) public {
        vm.startBroadcast();

        new StaffNFT(_serverBaseUrl);

        vm.stopBroadcast();
    }
}
