#! /usr/bin/env bash

cast send \
  --private-key "$PRIVATE_KEY" \
  --rpc-url "$RPC_URL" \
  "$USDC_CONTRACT_ADDRESS" \
  "mint(uint)" 100000000
