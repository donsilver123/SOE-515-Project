#! /usr/bin/env bash

# forge clean

forge script \
  ./script/DeployPermit2.s.sol:DeployPermit2 \
  --broadcast \
  --rpc-url "$RPC_URL" \
  --private-key "$PRIVATE_KEY" \
  --via-ir \
  --optimize \
  --verify \
  --verifier sourcify \
  --sig "run()" \
  --retries "$RETRY_COUNT" \
  -vvvv

forge script \
  ./script/DeployPlatformUSDC.s.sol:DeployPlatformUSDCScript \
  --broadcast \
  --rpc-url "$RPC_URL" \
  --private-key "$PRIVATE_KEY" \
  --sig "run()" \
  --verify \
  --verifier sourcify \
  --retries "$RETRY_COUNT" \
  -vvvv
