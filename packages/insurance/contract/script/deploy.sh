#! /usr/bin/env bash

forge clean

forge script \
  ./script/DeployStaffNFT.s.sol:DeployStaffNFTScript \
  --broadcast \
  --rpc-url "$RPC_URL" \
  --private-key "$PRIVATE_KEY" \
  --sig "run(string)" "$INSURANCE_INSTITUTION_SERVER_URL" \
  --retries "$RETRY_COUNT" \
  -vvvv

forge script \
  ./script/DeployInsuranceInstitution.s.sol:DeployInsuranceInstitutionScript \
  --broadcast \
  --rpc-url "$RPC_URL" \
  --private-key "$PRIVATE_KEY" \
  --sig "run(address)" "$USDC_CONTRACT_ADDRESS" \
  --retries "$RETRY_COUNT" \
  -vvvv
