#! /usr/bin/env bash

forge script \
  ./script/USDC.s.sol:DeployUSDCScript \
  --broadcast \
  --rpc-url "$RPC_URL" \
  --private-key "$PRIVATE_KEY" \
  --sig "run()" \
  --retries "$RETRY_COUNT" \
  -vvvv
