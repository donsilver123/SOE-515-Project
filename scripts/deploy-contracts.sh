#! /usr/bin/env bash

pnpm --filter @soe511/shared-contract run deploy && \
  pnpm --filter @soe511/insurance-contract run deploy && \
    pnpm --filter @soe511/medical-contract run deploy
