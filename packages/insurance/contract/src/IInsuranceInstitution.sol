// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;

interface IInsuranceInstitution {
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

    function getUserByAddress(
        address _userAddress
    ) external view returns (User memory);

    function getUserById(uint _userId) external view returns (User memory);

    function processClaim(
        bytes memory _signature,
        uint _userId,
        uint _claimAmount
    ) external;
}
