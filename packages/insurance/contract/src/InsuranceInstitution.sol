// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

import {console} from "forge-std/console.sol";
import {ECDSA} from "solady/utils/ECDSA.sol";
import {ERC20} from "solady/tokens/ERC20.sol";
import {IInsuranceInstitution} from "./IInsuranceInstitution.sol";
import {IPermit2} from "permit2/interfaces/IPermit2.sol";

contract InsuranceInstitution is IInsuranceInstitution {
    error UserAlreadyRegistered(address walletAddress);
    error InvalidPlan();
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
    event PlanPurchased(uint planId, uint userId);

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
        uint price;
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

    uint nextPlanId = 0;
    mapping(uint => InsurancePlan) public plans;

    mapping(uint => MedicalInstitution) public medicalInstitutions;
    uint public nextMedicalInstitutionId;
    mapping(address => uint) public addressToMedicalInstitutionId;

    mapping(uint => mapping(uint => uint)) userIdToAuthorizedMedicalInstitutionIdToNonce;

    address public immutable permit2ContractAddress;
    address public immutable usdcContractAddress;

    constructor(address _permit2ContractAddress, address _usdcContractAddress) {
        permit2ContractAddress = _permit2ContractAddress;
        usdcContractAddress = _usdcContractAddress;
    }

    function getPlanById(
        uint _planId
    ) public view returns (InsurancePlan memory) {
        return plans[_planId];
    }

    function getPlans() public view returns (InsurancePlan[] memory) {
        InsurancePlan[] memory _plans = new InsurancePlan[](nextPlanId);
        for (uint i = 0; i < nextPlanId; i++) {
            _plans[i] = plans[i];
        }
        return _plans;
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

    function checkUserRegistration(
        address _userAddress
    ) public view returns (bool) {
        return isUserRegistered(users[addressToUserId[_userAddress]]);
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

    function purchasePlan(uint _planId) public {
        InsurancePlan storage _plan = plans[_planId];
        if (!isPlanValid(_plan)) revert InvalidPlan();

        uint _userId = addressToUserId[msg.sender];
        User storage _user = users[_userId];
        if (!isUserRegistered(_user)) revert UserNotRegistered();

        IPermit2 permit2 = IPermit2(permit2ContractAddress);
        permit2.transferFrom(
            msg.sender,
            address(this),
            uint160(_plan.price),
            usdcContractAddress
        );

        _user.remainingCoverage += _plan.coverageLimit;

        emit PlanPurchased(_planId, _userId);
    }

    function permitAndPurchasePlan(
        IPermit2.PermitSingle calldata _permit,
        bytes calldata _signature,
        uint _planId
    ) public {
        IPermit2 permit2 = IPermit2(permit2ContractAddress);
        permit2.permit(msg.sender, _permit, _signature);

        purchasePlan(_planId);
    }

    function subscribeToPlan(uint _planId) public {
        User storage _user = users[addressToUserId[msg.sender]];
        if (!isUserRegistered(_user)) {
            revert UserNotRegistered();
        }

        InsurancePlan storage _plan = plans[_planId];
        if (!isPlanValid(_plan)) {
            revert InvalidPlan();
        }

        uint _newCoverageLimit = plans[_planId].coverageLimit;
        _user.coverageLimit += _newCoverageLimit;
        _user.remainingCoverage += _newCoverageLimit;

        emit UserSubscribedToPlan(_user.id, msg.sender, _planId);
    }

    function addInsurancePlan(
        string memory _name,
        uint _coverageLimit,
        uint _price,
        CoveredCondition[] calldata _coveredConditions
    ) public {
        InsurancePlan storage _newPlan = plans[nextPlanId];
        _newPlan.id = nextPlanId;
        _newPlan.name = _name;
        _newPlan.coverageLimit = _coverageLimit;
        _newPlan.price = _price;
        _newPlan.isValid = true;
        _newPlan.coveredConditions = _coveredConditions;

        nextPlanId++;

        emit InsurancePlanAdded(_newPlan.id, _name, _coverageLimit);
    }

    function setPlanValidity(uint _planId, bool _isValid) public {
        InsurancePlan storage _plan = plans[_planId];

        _plan.isValid = _isValid;

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
