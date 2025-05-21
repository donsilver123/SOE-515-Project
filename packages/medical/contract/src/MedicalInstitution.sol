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
        Service service,
        uint amount
    );

    struct UserVisit {
        uint id;
        address userAddress;
        Service service;
        uint visitTimestamp;
    }

    enum Service {
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

    string[] public services = [
        "REGULAR_CHECKUP",
        "CONSULTATION",
        "INFECTIOUS_DISEASES",
        "RESPIRATORY_ILLNESS",
        "CARDIOVASCULAR_DISEASES",
        "GASTROINTESTINAL_DISORDERS",
        "MUSCULOSKELETAL_CONDITIONS",
        "MENTAL_HEALTH_SERVICES",
        "MATERNITY_CARE",
        "PEDIATRIC_CARE",
        "EMERGENCY_CARE",
        "SURGICAL_PROCEDURES",
        "DIAGNOSTIC_TESTS",
        "PRESCRIPTION_DRUGS",
        "CANCER_TREATMENT",
        "DIABETES_MANAGEMENT",
        "ALLERGIES_AND_IMMUNOLOGY",
        "REHABILITATION_SERVICES",
        "VISION_CARE",
        "DENTAL_CARE",
        "OTHER"
    ];

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

    function getServices() public view returns (string[] memory) {
        return services;
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

    function processVisit(address _userAddress, Service _service) public {
        processVisit(_userAddress, _service, 0, bytes(""));
    }

    function processVisit(
        address _userAddress,
        Service _service,
        uint _nonce,
        bytes memory _insuranceSignature
    ) public {
        if (!isUserRegistered(_userAddress)) revert UserNotRegistered();

        uint _amountDue = getServiceCost(_service);

        UserVisit storage _newVisit = userVisits[nextUserVisitId];
        _newVisit.id = nextUserVisitId;
        _newVisit.userAddress = _userAddress;
        _newVisit.service = _service;
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
                _service,
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
                _service,
                _amountDue
            );
        }
    }

    function getServiceCost(Service _service) public view returns (uint) {
        ERC20 usdcContract = ERC20(usdcContractAddress);
        uint _decimals = usdcContract.decimals();

        if (_service == Service.REGULAR_CHECKUP) {
            return 50 * _decimals;
        } else if (_service == Service.CONSULTATION) {
            return 100 * _decimals;
        } else if (_service == Service.EMERGENCY_CARE) {
            return 500 * _decimals;
        } else if (_service == Service.SURGICAL_PROCEDURES) {
            return 1000 * _decimals;
        } else {
            return 75 * _decimals;
        }
    }
}
