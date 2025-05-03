#! /usr/bin/env bash

pnpm dotenv -e ".env.$APP_ENV" -- pnpm --recursive --parallel typegen
