#! /usr/bin/env bash

# forge clean

forge script \
  ./script/DeployInsuranceInstitution.s.sol:DeployInsuranceInstitution \
  --broadcast \
  --rpc-url "$RPC_URL" \
  --private-key "$PRIVATE_KEY" \
  --sig 'run(address,address)' "$PERMIT2_CONTRACT_ADDRESS" "$USDC_CONTRACT_ADDRESS" \
  --verify \
  --verifier sourcify \
  --retries "$RETRY_COUNT" \
  -vvvv
