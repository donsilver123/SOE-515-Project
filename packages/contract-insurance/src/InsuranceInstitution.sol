// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

contract InsuranceInstitution {
    error UserAlreadyRegistered(address walletAddress);
    error InvalidPlanId(uint planId);
    error UserNotRegistered(address walletAddress);
    error AlreadySubscribedToPlan(address walletAddress);
    error MedicalInstitutionAlreadyRegistered(address contractAddress);

    event NewUserRegistered(uint userId, address walletAddress);
    event UserSubscribedToPlan(uint userId, address walletAddress, uint planId);
    event InsurancePlanAdded(uint planId, string name, uint coverageLimit);
    event MedicalInstitutionRegistered(
        uint id,
        address contractAddress,
        string name
    );
    event PlanValidityUpdated(uint planId, bool isValid);

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

    User[] public users;
    mapping(address => uint) public addressToUserId;

    InsurancePlan[] public plans;

    MedicalInstitution[] public medicalInstitutions;
    mapping(address => uint) public addressToMedicalInstitutionId;

    mapping(uint => mapping(uint => bool)) UserAuthorizedMedicalInstitutions;

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

        uint newUserId = users.length;
        User storage newUser = users[newUserId];
        newUser.id = newUserId;
        newUser.walletAddress = msg.sender;
        newUser.isRegistered = true;

        addressToUserId[msg.sender] = newUser.id;

        emit NewUserRegistered(newUser.id, msg.sender);
    }

    function subscribeToPlan(uint _planId) public {
        User storage _user = users[addressToUserId[msg.sender]];
        if (!isUserRegistered(_user)) {
            revert UserNotRegistered(msg.sender);
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
        _newPlan.coveredConditions = _coveredConditions;
        _newPlan.isValid = true;

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

        uint _medicalInstitutionId = medicalInstitutions.length;
        MedicalInstitution storage _medicalInstitution = medicalInstitutions[
            _medicalInstitutionId
        ];
        _medicalInstitution.id = _medicalInstitutionId;
        _medicalInstitution.contractAddress = _contractAddress;
        _medicalInstitution.name = _name;
        _medicalInstitution.nonce = 0;

        emit MedicalInstitutionRegistered(
            _medicalInstitution.id,
            _contractAddress,
            _name
        );
    }
}
