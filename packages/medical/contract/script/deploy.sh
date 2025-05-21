#! /usr/bin/env bash

# forge clean

forge script \
  ./script/DeployMedicalInstitution.s.sol:DeployMedicalInstitution \
  --broadcast \
  --rpc-url "$RPC_URL" \
  --private-key "$PRIVATE_KEY" \
  --sig 'run(address,address)' "$INSURANCE_INSTITUTION_CONTRACT_ADDRESS" "$USDC_CONTRACT_ADDRESS" \
  --verify \
  --verifier sourcify \
  --retries "$RETRY_COUNT" \
  -vvvv
