#! /usr/bin/env bash

forge script \
  ./script/DeployPlatformUSDC.s.sol:DeployPlatformUSDCScript \
  --broadcast \
  --rpc-url "$RPC_URL" \
  --private-key "$PRIVATE_KEY" \
  --sig "run()" \
  --retries "$RETRY_COUNT" \
  -vvvv
