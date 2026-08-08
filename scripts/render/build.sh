#!/usr/bin/env bash

set -euo pipefail

readonly script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly repository_root="$(cd "${script_dir}/../.." && pwd)"

cd "$repository_root"

require_environment() {
  local name="$1"
  if [[ -z "${!name:-}" ]]; then
    echo "Required release environment variable is missing: ${name}" >&2
    exit 1
  fi
}

export RELEASE_SHA="${RELEASE_SHA:-${RENDER_GIT_COMMIT:-}}"
export NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-${RENDER_EXTERNAL_URL:-}}"

require_environment RENDER_GIT_COMMIT
require_environment RENDER_EXTERNAL_URL
require_environment RELEASE_SHA
require_environment NEXT_PUBLIC_API_URL

if [[ "${APP_ENV:-}" != "staging" && "${APP_ENV:-}" != "production" ]]; then
  echo "Render release builds require APP_ENV=staging or APP_ENV=production" >&2
  exit 1
fi

if [[ "${NEXT_PUBLIC_APP_ENV:-}" != "${APP_ENV}" ]]; then
  echo "APP_ENV and NEXT_PUBLIC_APP_ENV must match for a Render release" >&2
  exit 1
fi

echo "Building Kiteb release ${RELEASE_SHA:0:12} for ${APP_ENV}."

bash scripts/ci/install-dependencies.sh
bun run validate:release-env
bun run build:release
