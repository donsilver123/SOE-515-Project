#! /usr/bin/env bash

cast send \
  --private-key "$PRIVATE_KEY" \
  --rpc-url "$RPC_URL" \
  "$INSURANCE_INSTITUTION_CONTRACT_ADDRESS" \
  "addInsurancePlan(string,uint,uint8[])" 'BASIC' 10000 '[0,1,2,3,4]' \
  -vvvv \
  && \
  cast send \
    --private-key "$PRIVATE_KEY" \
    --rpc-url "$RPC_URL" \
    "$INSURANCE_INSTITUTION_CONTRACT_ADDRESS" \
    "addInsurancePlan(string,uint,uint8[])" 'INTERMEDIATE' 50000 '[0,1,2,3,4,5,6,7,8,9]' \
    -vvvv \
    && \
    cast send \
      --private-key "$PRIVATE_KEY" \
      --rpc-url "$RPC_URL" \
      "$INSURANCE_INSTITUTION_CONTRACT_ADDRESS" \
      "addInsurancePlan(string,uint,uint8[])" 'ADVANCED' 100000 '[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]' \
      -vvvv
