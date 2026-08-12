#!/usr/bin/env bash

set -euo pipefail

readonly package_dir="${SUPABASE_NPM_PACKAGE_DIR:-node_modules/supabase}"
readonly package_json="${package_dir}/package.json"

if [[ ! -f "$package_json" ]]; then
  echo "Supabase CLI package metadata was not installed at ${package_json}."
  exit 1
fi

version="$({
  sed -n 's/^[[:space:]]*"version":[[:space:]]*"\([^"]*\)".*/\1/p' "$package_json" |
    head -n 1
})"

if [[ ! "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+([.-][0-9A-Za-z.-]+)?$ ]]; then
  echo "Unable to determine a safe Supabase CLI version from ${package_json}."
  exit 1
fi

case "$(uname -s)" in
  Linux)
    platform="linux"
    binary_name="supabase"
    ;;
  Darwin)
    platform="darwin"
    binary_name="supabase"
    ;;
  MINGW* | MSYS* | CYGWIN*)
    platform="windows"
    binary_name="supabase.exe"
    ;;
  *)
    echo "Unsupported Supabase CLI platform: $(uname -s)"
    exit 1
    ;;
esac

case "$(uname -m)" in
  x86_64 | amd64)
    arch="amd64"
    ;;
  arm64 | aarch64)
    arch="arm64"
    ;;
  *)
    echo "Unsupported Supabase CLI architecture: $(uname -m)"
    exit 1
    ;;
esac

readonly bin_dir="${package_dir}/bin"
readonly binary_path="${bin_dir}/${binary_name}"
readonly archive_name="supabase_${platform}_${arch}.tar.gz"
readonly checksums_name="supabase_${version}_checksums.txt"
readonly release_base="https://github.com/supabase/cli/releases/download/v${version}"

if [[ -x "$binary_path" ]] && "$binary_path" --version 2>/dev/null | grep -Fq "$version"; then
  echo "Supabase CLI ${version} is already installed."
  exit 0
fi

if ! command -v curl >/dev/null 2>&1; then
  echo "curl is required to install the Supabase CLI."
  exit 1
fi

if ! command -v tar >/dev/null 2>&1; then
  echo "tar is required to install the Supabase CLI."
  exit 1
fi

temp_dir="$(mktemp -d)"
trap 'rm -rf "$temp_dir"' EXIT

readonly checksums_path="${temp_dir}/${checksums_name}"
readonly archive_path="${temp_dir}/${archive_name}"
readonly extract_dir="${temp_dir}/extract"
mkdir -p "$extract_dir" "$bin_dir"

download() {
  local url="$1"
  local destination="$2"

  echo "Downloading ${url}"
  curl \
    --fail \
    --location \
    --silent \
    --show-error \
    --proto '=https' \
    --tlsv1.2 \
    --connect-timeout 20 \
    --max-time 180 \
    --retry 8 \
    --retry-delay 2 \
    --retry-max-time 300 \
    --retry-all-errors \
    --output "$destination" \
    "$url"
}

download "${release_base}/${checksums_name}" "$checksums_path"
download "${release_base}/${archive_name}" "$archive_path"

expected_checksum="$(
  awk -v archive="$archive_name" '$2 == archive { print $1; exit }' "$checksums_path"
)"

if [[ ! "$expected_checksum" =~ ^[0-9a-fA-F]{64}$ ]]; then
  echo "No valid SHA-256 checksum was published for ${archive_name}."
  exit 1
fi

if command -v sha256sum >/dev/null 2>&1; then
  actual_checksum="$(sha256sum "$archive_path" | awk '{ print $1 }')"
elif command -v shasum >/dev/null 2>&1; then
  actual_checksum="$(shasum -a 256 "$archive_path" | awk '{ print $1 }')"
else
  echo "sha256sum or shasum is required to verify the Supabase CLI archive."
  exit 1
fi

if [[ "${actual_checksum,,}" != "${expected_checksum,,}" ]]; then
  echo "Checksum mismatch for ${archive_name}; refusing to install it."
  exit 1
fi

tar -xzf "$archive_path" -C "$extract_dir" "$binary_name"
install -m 0755 "${extract_dir}/${binary_name}" "$binary_path"

mkdir -p node_modules/.bin
ln -sfn "../supabase/bin/${binary_name}" node_modules/.bin/supabase

installed_version="$($binary_path --version 2>&1)"
if [[ "$installed_version" != *"$version"* ]]; then
  echo "Installed Supabase CLI version did not match ${version}: ${installed_version}"
  exit 1
fi

echo "Installed and verified Supabase CLI ${version}."
