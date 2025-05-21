// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {MedicalInstitution} from "../src/MedicalInstitution.sol";

contract DeployMedicalInstitution is Script {
    function run(
        address _insuranceInstitutionContractAddress,
        address _usdcContractAddress
    ) public {
        vm.startBroadcast();

        new MedicalInstitution(_insuranceInstitutionContractAddress, _usdcContractAddress);

        vm.stopBroadcast();
    }
}
