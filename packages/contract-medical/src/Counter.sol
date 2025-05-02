// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import {ERC20} from "solady/tokens/ERC20.sol";

contract MedicalInstitution {
    error USDCTransferFailed();
    error UserNotRegistered();

    event UserRegistered(address userAddress);
    event VisitProcessed(
        uint visitId,
        address userAddress,
        CoveredCondition purpose,
        uint amount
    );

    struct UserVisit {
        uint id;
        address userAddress;
        CoveredCondition purpose;
        uint visitTimestamp;
    }

    enum CoveredCondition {
        REGULAR_CHECKUP,
        CONSULTATION,
        INFECTIOUS_DISEASES,
        RESPIRATORY_ILLNESS,
        CARDIOVASCULAR_DISEASES,
        GASTROINTESTINAL_DISORDERS,
        MUSCULOSKELETAL_CONDITIONS,
        MENTAL_HEALTH_SERVICES,
        MATERNITY_CARE,
        PEDIATRIC_CARE,
        EMERGENCY_CARE,
        SURGICAL_PROCEDURES,
        DIAGNOSTIC_TESTS,
        PRESCRIPTION_DRUGS,
        CANCER_TREATMENT,
        DIABETES_MANAGEMENT,
        ALLERGIES_AND_IMMUNOLOGY,
        REHABILITATION_SERVICES,
        VISION_CARE,
        DENTAL_CARE,
        OTHER
    }

    address public immutable insuranceContractAddress;

    address public immutable usdcContractAddress;
    mapping(address => bool) public registeredUsers;
    mapping(uint => UserVisit) public userVisits;

    constructor(
        address _usdcContractAddress,
        address _insuranceContractAddress
    ) {
        usdcContractAddress = _usdcContractAddress;
        insuranceContractAddress = _insuranceContractAddress;
    }

    function registerUser(address _userAddress) public {
        require(
            !registeredUsers[_userAddress],
            "User address already registered."
        );
        registeredUsers[_userAddress] = true;
        emit UserRegistered(_userAddress);
    }

    function processVisit(
        address _userAddress,
        CoveredCondition _purpose
    ) public {
        processVisit(_userAddress, _purpose, 0, bytes(""));
    }

    function processVisit(
        address _userAddress,
        CoveredCondition _purpose,
        uint _nonce,
        bytes memory _insuranceSignature
    ) public {
        if (!registeredUsers[_userAddress]) revert UserNotRegistered();

        uint amountDue = getServiceCost(_purpose);

        uint _newVisitId = userVisits.length;
        UserVisit storage newVisit = userVisits[_newVisitId];
        _newVisit.id = _newVisitId;
        _newVisit.userAddress = _userAddress;
        _newVisit.purpose = _purpose;
        _newVisit.visitTimestamp = block.timestamp;

        if (_insuranceSignature.length > 0) {
            IInsuranceInstitution insurance = IInsuranceInstitution(
                insuranceContractAddress
            );
            uint insuranceUserId = userToInsuranceId[_userAddress];

            insurance.processClaim(
                _insuranceSignature,
                insuranceUserId,
                amountDue,
                _nonce
            );
            emit InsuranceClaimSubmitted(
                newVisit.id,
                _userAddress,
                _purpose,
                amountDue,
                _insuranceSignature,
                _nonce
            );
            emit VisitProcessed(newVisit.id, _userAddress, _purpose, amountDue);
        } else {
            ERC20 usdc = ERC20(usdcContractAddress);
            bool success = usdc.transferFrom(
                _userAddress,
                address(this),
                amountDue
            );
            if (!success) revert USDCTransferFailed();

            emit VisitProcessed(newVisit.id, _userAddress, _purpose, amountDue);
        }
    }

    function getServiceCost(
        CoveredCondition _purpose
    ) public pure returns (uint) {
        ERC20 usdcContract = ERC20(usdcContractAddress);
        uint _decimals = usdcContract.decimals();

        if (_purpose == CoveredCondition.REGULAR_CHECKUP) {
            return 50 * _decimals;
        } else if (_purpose == CoveredCondition.CONSULTATION) {
            return 100 * _decimals;
        } else if (_purpose == CoveredCondition.EMERGENCY_CARE) {
            return 500 * _decimals;
        } else if (_purpose == CoveredCondition.SURGICAL_PROCEDURES) {
            return 1000 * _decimals;
        } else {
            return 75 * _decimals;
        }
    }
}
