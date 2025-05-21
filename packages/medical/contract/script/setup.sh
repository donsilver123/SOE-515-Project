#! /usr/bin/env bash

cast send \
  --private-key "$PRIVATE_KEY" \
  --rpc-url "$RPC_URL" \
  "$INSURANCE_INSTITUTION_CONTRACT_ADDRESS" \
  "registerMedicalInstitution(address,string)" "$MEDICAL_INSTITUTION_CONTRACT_ADDRESS" "Saint Peter's Hospital" \
  -vvvv
