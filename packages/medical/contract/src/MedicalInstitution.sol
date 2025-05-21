// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import {ERC20} from "solady/tokens/ERC20.sol";
import {IInsuranceInstitution} from "insurance/IInsuranceInstitution.sol";

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

    address public immutable insuranceInstitutionContractAddress;

    address public immutable usdcContractAddress;
    mapping(address => bool) public registeredUsers;
    mapping(uint => UserVisit) public userVisits;
    uint nextUserVisitId = 0;

    constructor(
        address _insuranceInstitutionContractAddress,
        address _usdcContractAddress
    ) {
        insuranceInstitutionContractAddress = _insuranceInstitutionContractAddress;
        usdcContractAddress = _usdcContractAddress;
    }

    function isUserRegistered(address _userAddress) public view returns (bool) {
        return registeredUsers[_userAddress];
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
        if (!isUserRegistered(_userAddress)) revert UserNotRegistered();

        uint _amountDue = getServiceCost(_purpose);

        UserVisit storage _newVisit = userVisits[nextUserVisitId];
        _newVisit.id = nextUserVisitId;
        _newVisit.userAddress = _userAddress;
        _newVisit.purpose = _purpose;
        _newVisit.visitTimestamp = block.timestamp;

        nextUserVisitId++;

        if (_insuranceSignature.length > 0) {
            IInsuranceInstitution insurance = IInsuranceInstitution(
                insuranceInstitutionContractAddress
            );
            IInsuranceInstitution.User memory insuranceUser = insurance
                .getUserByAddress(_userAddress);

            insurance.processClaim(
                _insuranceSignature,
                insuranceUser.id,
                _amountDue,
                _nonce
            );
            emit VisitProcessed(
                _newVisit.id,
                _userAddress,
                _purpose,
                _amountDue
            );
        } else {
            ERC20 usdc = ERC20(usdcContractAddress);
            bool success = usdc.transferFrom(
                _userAddress,
                address(this),
                _amountDue
            );
            if (!success) revert USDCTransferFailed();

            emit VisitProcessed(
                _newVisit.id,
                _userAddress,
                _purpose,
                _amountDue
            );
        }
    }

    function getServiceCost(
        CoveredCondition _purpose
    ) public view returns (uint) {
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
