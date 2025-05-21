#! /usr/bin/env bash


pnpm --filter @soe511/shared-contract run setup && \
  pnpm --filter @soe511/insurance-contract run setup && \
    pnpm --filter @soe511/medical-contract run setup
