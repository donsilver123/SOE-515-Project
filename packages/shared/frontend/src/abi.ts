//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// InsuranceInstitution
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const insuranceInstitutionAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_permit2ContractAddress',
        internalType: 'address',
        type: 'address',
      },
      {
        name: '_usdcContractAddress',
        internalType: 'address',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_coverageLimit', internalType: 'uint256', type: 'uint256' },
      { name: '_price', internalType: 'uint256', type: 'uint256' },
      {
        name: '_coveredConditions',
        internalType: 'enum IInsuranceInstitution.CoveredCondition[]',
        type: 'uint8[]',
      },
    ],
    name: 'addInsurancePlan',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'addressToMedicalInstitutionId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'addressToUserId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
    ],
    name: 'checkUserRegistration',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'coveredConditions',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCoveredConditions',
    outputs: [{ name: '', internalType: 'string[]', type: 'string[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_planId', internalType: 'uint256', type: 'uint256' }],
    name: 'getPlanById',
    outputs: [
      {
        name: '',
        internalType: 'struct IInsuranceInstitution.InsurancePlan',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'coverageLimit', internalType: 'uint256', type: 'uint256' },
          { name: 'isValid', internalType: 'bool', type: 'bool' },
          { name: 'price', internalType: 'uint256', type: 'uint256' },
          {
            name: 'coveredConditions',
            internalType: 'enum IInsuranceInstitution.CoveredCondition[]',
            type: 'uint8[]',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getPlans',
    outputs: [
      {
        name: '',
        internalType: 'struct IInsuranceInstitution.InsurancePlan[]',
        type: 'tuple[]',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'coverageLimit', internalType: 'uint256', type: 'uint256' },
          { name: 'isValid', internalType: 'bool', type: 'bool' },
          { name: 'price', internalType: 'uint256', type: 'uint256' },
          {
            name: 'coveredConditions',
            internalType: 'enum IInsuranceInstitution.CoveredCondition[]',
            type: 'uint8[]',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
    ],
    name: 'getUserByAddress',
    outputs: [
      {
        name: '',
        internalType: 'struct IInsuranceInstitution.User',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'walletAddress', internalType: 'address', type: 'address' },
          { name: 'coverageLimit', internalType: 'uint256', type: 'uint256' },
          {
            name: 'remainingCoverage',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'isRegistered', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '_userId', internalType: 'uint256', type: 'uint256' }],
    name: 'getUserById',
    outputs: [
      {
        name: '',
        internalType: 'struct IInsuranceInstitution.User',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'walletAddress', internalType: 'address', type: 'address' },
          { name: 'coverageLimit', internalType: 'uint256', type: 'uint256' },
          {
            name: 'remainingCoverage',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'isRegistered', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_medicalInstitutionId',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'getUserNonceForMedicalInstitutionAuthorization',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_medicalInstitution',
        internalType: 'struct IInsuranceInstitution.MedicalInstitution',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'contractAddress', internalType: 'address', type: 'address' },
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'nonce', internalType: 'uint256', type: 'uint256' },
          { name: 'isRegistered', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    name: 'isMedicalInstitutionRegistered',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_plan',
        internalType: 'struct IInsuranceInstitution.InsurancePlan',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'coverageLimit', internalType: 'uint256', type: 'uint256' },
          { name: 'isValid', internalType: 'bool', type: 'bool' },
          { name: 'price', internalType: 'uint256', type: 'uint256' },
          {
            name: 'coveredConditions',
            internalType: 'enum IInsuranceInstitution.CoveredCondition[]',
            type: 'uint8[]',
          },
        ],
      },
    ],
    name: 'isPlanValid',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_user',
        internalType: 'struct IInsuranceInstitution.User',
        type: 'tuple',
        components: [
          { name: 'id', internalType: 'uint256', type: 'uint256' },
          { name: 'walletAddress', internalType: 'address', type: 'address' },
          { name: 'coverageLimit', internalType: 'uint256', type: 'uint256' },
          {
            name: 'remainingCoverage',
            internalType: 'uint256',
            type: 'uint256',
          },
          { name: 'isRegistered', internalType: 'bool', type: 'bool' },
        ],
      },
    ],
    name: 'isUserRegistered',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'medicalInstitutions',
    outputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'contractAddress', internalType: 'address', type: 'address' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'nonce', internalType: 'uint256', type: 'uint256' },
      { name: 'isRegistered', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'nextMedicalInstitutionId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'nextUserId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'permit2ContractAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_permit',
        internalType: 'struct IAllowanceTransfer.PermitSingle',
        type: 'tuple',
        components: [
          {
            name: 'details',
            internalType: 'struct IAllowanceTransfer.PermitDetails',
            type: 'tuple',
            components: [
              { name: 'token', internalType: 'address', type: 'address' },
              { name: 'amount', internalType: 'uint160', type: 'uint160' },
              { name: 'expiration', internalType: 'uint48', type: 'uint48' },
              { name: 'nonce', internalType: 'uint48', type: 'uint48' },
            ],
          },
          { name: 'spender', internalType: 'address', type: 'address' },
          { name: 'sigDeadline', internalType: 'uint256', type: 'uint256' },
        ],
      },
      { name: '_signature', internalType: 'bytes', type: 'bytes' },
      { name: '_planId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'permitAndPurchasePlan',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'plans',
    outputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'coverageLimit', internalType: 'uint256', type: 'uint256' },
      { name: 'isValid', internalType: 'bool', type: 'bool' },
      { name: 'price', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_signature', internalType: 'bytes', type: 'bytes' },
      { name: '_userId', internalType: 'uint256', type: 'uint256' },
      { name: '_claimAmount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'processClaim',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_planId', internalType: 'uint256', type: 'uint256' }],
    name: 'purchasePlan',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_contractAddress', internalType: 'address', type: 'address' },
      { name: '_name', internalType: 'string', type: 'string' },
    ],
    name: 'registerMedicalInstitution',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'registerNewUser',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_planId', internalType: 'uint256', type: 'uint256' },
      { name: '_isValid', internalType: 'bool', type: 'bool' },
    ],
    name: 'setPlanValidity',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '_planId', internalType: 'uint256', type: 'uint256' }],
    name: 'subscribeToPlan',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'usdcContractAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'users',
    outputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'walletAddress', internalType: 'address', type: 'address' },
      { name: 'coverageLimit', internalType: 'uint256', type: 'uint256' },
      { name: 'remainingCoverage', internalType: 'uint256', type: 'uint256' },
      { name: 'isRegistered', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'userId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'medicalInstitutionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ClaimProcessed',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'planId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
      {
        name: 'coverageLimit',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'InsurancePlanAdded',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'contractAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'name', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'MedicalInstitutionRegistered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'userId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'walletAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'NewUserRegistered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'planId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'userId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'PlanPurchased',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'planId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'isValid', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'PlanValidityUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'userId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'walletAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'planId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'UserSubscribedToPlan',
  },
  {
    type: 'error',
    inputs: [
      { name: 'walletAddress', internalType: 'address', type: 'address' },
    ],
    name: 'AlreadySubscribedToPlan',
  },
  { type: 'error', inputs: [], name: 'InsufficientRemainingUserCcoverage' },
  { type: 'error', inputs: [], name: 'InsufficientUserCoverage' },
  { type: 'error', inputs: [], name: 'InvalidPlan' },
  { type: 'error', inputs: [], name: 'InvalidUserSignature' },
  {
    type: 'error',
    inputs: [
      { name: 'contractAddress', internalType: 'address', type: 'address' },
    ],
    name: 'MedicalInstitutionAlreadyRegistered',
  },
  { type: 'error', inputs: [], name: 'MedicalInstitutionNotAuthorizedByUser' },
  { type: 'error', inputs: [], name: 'MedicalInstitutionNotRegistered' },
  { type: 'error', inputs: [], name: 'USDCTransferFailed' },
  {
    type: 'error',
    inputs: [
      { name: 'walletAddress', internalType: 'address', type: 'address' },
    ],
    name: 'UserAlreadyRegistered',
  },
  { type: 'error', inputs: [], name: 'UserNotRegistered' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// MedicalInstitution
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const medicalInstitutionAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: '_insuranceInstitutionContractAddress',
        internalType: 'address',
        type: 'address',
      },
      {
        name: '_usdcContractAddress',
        internalType: 'address',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_service',
        internalType: 'enum MedicalInstitution.Service',
        type: 'uint8',
      },
    ],
    name: 'getServiceCost',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getServices',
    outputs: [{ name: '', internalType: 'string[]', type: 'string[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'insuranceInstitutionContractAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
    ],
    name: 'isUserRegistered',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
      {
        name: '_service',
        internalType: 'enum MedicalInstitution.Service',
        type: 'uint8',
      },
    ],
    name: 'processVisit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
      {
        name: '_service',
        internalType: 'enum MedicalInstitution.Service',
        type: 'uint8',
      },
      { name: '_insuranceSignature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'processVisit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_userAddress', internalType: 'address', type: 'address' },
    ],
    name: 'registerUser',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'registeredUsers',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'services',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'usdcContractAddress',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'userVisits',
    outputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'userAddress', internalType: 'address', type: 'address' },
      {
        name: 'service',
        internalType: 'enum MedicalInstitution.Service',
        type: 'uint8',
      },
      { name: 'visitTimestamp', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'userAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'UserRegistered',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'visitId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'userAddress',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'service',
        internalType: 'enum MedicalInstitution.Service',
        type: 'uint8',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'VisitProcessed',
  },
  { type: 'error', inputs: [], name: 'USDCTransferFailed' },
  { type: 'error', inputs: [], name: 'UserNotRegistered' },
] as const
