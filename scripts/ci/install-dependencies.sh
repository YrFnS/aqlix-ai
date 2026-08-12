#!/usr/bin/env bash

set -euo pipefail

readonly max_attempts=3
readonly dependency_timeout_seconds=180
readonly supabase_cli_timeout_seconds=420

install_once() {
  # An explicit empty trustedDependencies allowlist keeps the root workspace
  # lifecycle intact while blocking dependency postinstall scripts, including
  # Supabase's unbounded native-binary download.
  timeout --signal=TERM "${dependency_timeout_seconds}s" \
    bun install --frozen-lockfile || return $?

  timeout --signal=TERM "${supabase_cli_timeout_seconds}s" \
    bash scripts/ci/install-supabase-cli.sh || return $?
}

for attempt in $(seq 1 "$max_attempts"); do
  echo "Installing dependencies and verified CLI tools (attempt ${attempt}/${max_attempts})..."

  if install_once; then
    echo "Dependency and CLI installation completed."
    exit 0
  else
    status=$?
  fi

  if [[ "$attempt" -eq "$max_attempts" ]]; then
    echo "Dependency or CLI installation failed after ${max_attempts} attempts with status ${status}."
    exit "$status"
  fi

  echo "Installation failed or timed out; clearing local modules and Bun's package cache before retrying."
  rm -rf node_modules
  bun pm cache rm || true
  sleep "$((attempt * 2))"
done
