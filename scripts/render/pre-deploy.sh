#!/usr/bin/env bash

set -euo pipefail

readonly script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly repository_root="$(cd "${script_dir}/../.." && pwd)"

cd "$repository_root"

require_environment() {
  local name="$1"
  if [[ -z "${!name:-}" ]]; then
    echo "Required migration environment variable is missing: ${name}" >&2
    exit 1
  fi
}

require_environment APP_ENV
require_environment SUPABASE_ACCESS_TOKEN
require_environment SUPABASE_DB_PASSWORD
require_environment SUPABASE_PROJECT_ID

if [[ "$APP_ENV" != "staging" && "$APP_ENV" != "production" ]]; then
  echo "Remote migrations are permitted only for staging or production." >&2
  exit 1
fi

if [[ "$APP_ENV" == "production" && "${ALLOW_PRODUCTION_MIGRATIONS:-false}" != "true" ]]; then
  echo "Production migrations require ALLOW_PRODUCTION_MIGRATIONS=true." >&2
  exit 1
fi

echo "Linking the repository to the ${APP_ENV} Supabase project."
bunx supabase link \
  --project-ref "$SUPABASE_PROJECT_ID" \
  --password "$SUPABASE_DB_PASSWORD" \
  --yes

echo "Migration history before deployment:"
bunx supabase migration list --linked

echo "Dry-running pending migrations:"
bunx supabase db push --linked --dry-run --yes

echo "Applying committed migrations in timestamp order:"
bunx supabase db push --linked --yes

echo "Migration history after deployment:"
bunx supabase migration list --linked
