// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

interface IInsuranceInstitution {
    function processClaim(
        bytes memory _signature,
        uint _userId,
        uint _claimAmount,
        uint _nonce
    ) external;
}
