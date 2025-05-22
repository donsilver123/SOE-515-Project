#! /usr/bin/env bash

pnpm --filter @soe511/shared-contract run build && \
  pnpm --filter @soe511/insurance-contract run build && \
    pnpm --filter @soe511/medical-contract run build
