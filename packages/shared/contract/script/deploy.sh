#! /usr/bin/env bash

forge clean

forge script \
  ./lib/permit2/script/DeployPermit2.s.sol:DeployPermit2 \
  --broadcast \
  --rpc-url "$RPC_URL" \
  --private-key "$PRIVATE_KEY" \
  --sig "run()" \
  --retries "$RETRY_COUNT" \
  -vvvv

forge script \
  ./script/DeployPlatformUSDC.s.sol:DeployPlatformUSDCScript \
  --broadcast \
  --rpc-url "$RPC_URL" \
  --private-key "$PRIVATE_KEY" \
  --sig "run()" \
  --retries "$RETRY_COUNT" \
  -vvvv
