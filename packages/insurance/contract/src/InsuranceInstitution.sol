// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import {ECDSA} from "solady/utils/ECDSA.sol";
import {ERC20} from "solady/tokens/ERC20.sol";
import {IInsuranceInstitution} from "./IInsuranceInstitution.sol";

contract InsuranceInstitution is IInsuranceInstitution {
    error UserAlreadyRegistered(address walletAddress);
    error InvalidPlanId(uint planId);
    error UserNotRegistered();
    error AlreadySubscribedToPlan(address walletAddress);
    error MedicalInstitutionAlreadyRegistered(address contractAddress);
    error MedicalInstitutionNotRegistered();
    error MedicalInstitutionNotAuthorizedByUser();
    error InvalidUserSignature();
    error InsufficientUserCoverage();
    error USDCTransferFailed();
    error InsufficientRemainingUserCcoverage();

    event NewUserRegistered(uint userId, address walletAddress);
    event UserSubscribedToPlan(uint userId, address walletAddress, uint planId);
    event InsurancePlanAdded(uint planId, string name, uint coverageLimit);
    event MedicalInstitutionRegistered(
        uint id,
        address contractAddress,
        string name
    );
    event PlanValidityUpdated(uint planId, bool isValid);
    event ClaimProcessed(uint userId, uint medicalInstitutionId, uint amount);

    struct User {
        uint id;
        address walletAddress;
        uint coverageLimit;
        uint remainingCoverage;
        bool isRegistered;
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

    string[] public coveredConditions = [
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

    struct InsurancePlan {
        uint id;
        string name;
        uint coverageLimit;
        bool isValid;
        CoveredCondition[] coveredConditions;
    }

    struct MedicalInstitution {
        uint id;
        address contractAddress;
        string name;
        uint nonce;
        bool isRegistered;
    }

    mapping(uint => User) public users;
    uint public nextUserId = 0;
    mapping(address => uint) public addressToUserId;

    InsurancePlan[] public plans;

    mapping(uint => MedicalInstitution) public medicalInstitutions;
    uint public nextMedicalInstitutionId;
    mapping(address => uint) public addressToMedicalInstitutionId;

    mapping(uint => mapping(uint => uint)) userIdToAuthorizedMedicalInstitutionIdToNonce;

    address public immutable usdcContractAddress;

    constructor(address _usdcContractAddress) {
        usdcContractAddress = _usdcContractAddress;
    }

    function getPlanById(
        uint _planId
    ) public view returns (InsurancePlan memory) {
        return plans[_planId];
    }

    function getPlans() public view returns (InsurancePlan[] memory) {
        return plans;
    }

    function getCoveredConditions() public view returns (string[] memory) {
        return coveredConditions;
    }

    function getUserById(uint _userId) public view returns (User memory) {
        return users[_userId];
    }

    function isPlanValid(
        InsurancePlan memory _plan
    ) public pure returns (bool) {
        return _plan.isValid;
    }

    function isUserRegistered(User memory _user) public pure returns (bool) {
        return _user.isRegistered;
    }

    function isMedicalInstitutionRegistered(
        MedicalInstitution memory _medicalInstitution
    ) public pure returns (bool) {
        return _medicalInstitution.isRegistered;
    }

    function registerNewUser() public {
        User storage _existingUser = users[addressToUserId[msg.sender]];
        if (isUserRegistered(_existingUser)) {
            revert UserAlreadyRegistered(msg.sender);
        }

        uint _newUserId = nextUserId;
        User storage newUser = users[_newUserId];
        newUser.id = _newUserId;
        newUser.walletAddress = msg.sender;
        newUser.isRegistered = true;
        nextUserId++;

        addressToUserId[msg.sender] = newUser.id;

        emit NewUserRegistered(newUser.id, msg.sender);
    }

    function subscribeToPlan(uint _planId) public {
        User storage _user = users[addressToUserId[msg.sender]];
        if (!isUserRegistered(_user)) {
            revert UserNotRegistered();
        }
        if (_planId >= plans.length || _planId < 0) {
            revert InvalidPlanId(_planId);
        }

        uint _newCoverageLimit = plans[_planId].coverageLimit;
        _user.coverageLimit += _newCoverageLimit;
        _user.remainingCoverage += _newCoverageLimit;

        emit UserSubscribedToPlan(_user.id, msg.sender, _planId);
    }

    function addInsurancePlan(
        string memory _name,
        uint _coverageLimit,
        CoveredCondition[] calldata _coveredConditions
    ) public {
        uint _newPlanId = plans.length;
        InsurancePlan storage _newPlan = plans[_newPlanId];
        _newPlan.id = plans.length;
        _newPlan.name = _name;
        _newPlan.coverageLimit = _coverageLimit;
        _newPlan.isValid = true;
        _newPlan.coveredConditions = _coveredConditions;

        emit InsurancePlanAdded(_newPlan.id, _name, _coverageLimit);
    }

    function setPlanValidity(uint _planId, bool _isValid) public {
        if (_planId >= plans.length) revert InvalidPlanId(_planId);

        plans[_planId].isValid = _isValid;

        emit PlanValidityUpdated(_planId, _isValid);
    }

    function registerMedicalInstitution(
        address _contractAddress,
        string memory _name
    ) public {
        MedicalInstitution
            storage _existingMedicalInstitution = medicalInstitutions[
                addressToMedicalInstitutionId[_contractAddress]
            ];
        if (isMedicalInstitutionRegistered(_existingMedicalInstitution)) {
            revert MedicalInstitutionAlreadyRegistered(_contractAddress);
        }

        uint _medicalInstitutionId = nextMedicalInstitutionId;
        MedicalInstitution storage _medicalInstitution = medicalInstitutions[
            _medicalInstitutionId
        ];
        _medicalInstitution.id = _medicalInstitutionId;
        _medicalInstitution.contractAddress = _contractAddress;
        _medicalInstitution.name = _name;
        _medicalInstitution.nonce = 0;
        nextMedicalInstitutionId++;

        emit MedicalInstitutionRegistered(
            _medicalInstitution.id,
            _contractAddress,
            _name
        );
    }

    // hash schema: <userId><medicalInstitutionId><claimAmount><nonce>
    function processClaim(
        bytes memory _signature,
        uint _userId,
        uint _claimAmount,
        uint _nonce
    ) public {
        MedicalInstitution memory _medicalInstitution = medicalInstitutions[
            addressToMedicalInstitutionId[msg.sender]
        ];
        if (!isMedicalInstitutionRegistered(_medicalInstitution))
            revert MedicalInstitutionNotRegistered();

        User memory _user = users[_userId];

        if (!isUserRegistered(_user)) revert UserNotRegistered();

        if (
            userIdToAuthorizedMedicalInstitutionIdToNonce[_user.id][
                _medicalInstitution.id
            ] == 0
        ) revert MedicalInstitutionNotAuthorizedByUser();

        bytes32 _messageHash = keccak256(
            abi.encodePacked(
                _user.id,
                _medicalInstitution.id,
                _claimAmount,
                _nonce
            )
        );
        bytes32 _prefixedHash = ECDSA.toEthSignedMessageHash(_messageHash);
        address _signer = ECDSA.recover(_prefixedHash, _signature);

        if (_signer != _user.walletAddress) revert InvalidUserSignature();

        if (_user.remainingCoverage < _claimAmount)
            revert InsufficientUserCoverage();

        if (users[_userId].remainingCoverage < _claimAmount)
            revert InsufficientRemainingUserCcoverage();

        users[_userId].remainingCoverage -= _claimAmount;

        ERC20 usdc = ERC20(usdcContractAddress);
        bool success = usdc.transfer(
            _medicalInstitution.contractAddress,
            _claimAmount
        );
        if (!success) revert USDCTransferFailed();

        userIdToAuthorizedMedicalInstitutionIdToNonce[_user.id][
            _medicalInstitution.id
        ] += 1;

        emit ClaimProcessed(_userId, _medicalInstitution.id, _claimAmount);
    }
}
