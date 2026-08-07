#!/usr/bin/env bash

set -euo pipefail

readonly max_attempts=2
readonly attempt_timeout_seconds=150

for attempt in $(seq 1 "$max_attempts"); do
  echo "Installing dependencies with Bun (attempt ${attempt}/${max_attempts})..."

  if timeout --signal=TERM "${attempt_timeout_seconds}s" \
    bun install --frozen-lockfile; then
    echo "Dependency installation completed."
    exit 0
  fi

  status=$?

  if [[ "$attempt" -eq "$max_attempts" ]]; then
    echo "Dependency installation failed after ${max_attempts} attempts."
    exit "$status"
  fi

  echo "Dependency installation failed or timed out; clearing local modules and Bun's global package cache before one retry."
  rm -rf node_modules
  bun pm cache rm || true
  sleep 2
done
