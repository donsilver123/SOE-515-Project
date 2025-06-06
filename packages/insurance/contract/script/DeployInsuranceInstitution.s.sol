// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {InsuranceInstitution} from "../src/InsuranceInstitution.sol";

contract DeployInsuranceInstitution is Script {
    function run(
        address _permit2ContractAddress,
        address _usdcContractAddress
    ) public {
        vm.startBroadcast();

        new InsuranceInstitution(_permit2ContractAddress, _usdcContractAddress);

        vm.stopBroadcast();
    }
}
