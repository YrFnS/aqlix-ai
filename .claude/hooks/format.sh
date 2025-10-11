#!/bin/bash
# Iraqi AI Chat System - Monorepo Formatting Hook
# Handles all file formatting across the entire monorepo (Python, TypeScript, JavaScript, CSS, JSON, Markdown)

set -e

echo "🎨 Running monorepo-wide formatting..."

# Format Python files in apps/api
if [[ -d "apps/api" ]]; then
    echo "🐍 Formatting Python files (apps/api)..."
    (cd apps/api && ruff format . 2>/dev/null) || true
    echo "✅ Python formatting complete"
fi

# Format all TypeScript/JavaScript/CSS/JSON files in the monorepo
if command -v bun >/dev/null 2>&1; then
    echo "⚛️  Formatting TypeScript/JavaScript/CSS/JSON files (monorepo-wide)..."

    # Format apps
    bun x prettier --write "apps/**/*.{ts,tsx,js,jsx,json,css,scss,md}" 2>/dev/null || true

    # Format packages
    bun x prettier --write "packages/**/*.{ts,tsx,js,jsx,json,css,scss,md}" 2>/dev/null || true

    # Format root-level config files
    bun x prettier --write "*.{ts,tsx,js,jsx,json,md}" 2>/dev/null || true

    echo "✅ TypeScript/JavaScript/CSS/JSON formatting complete"
fi

echo "✅ Monorepo formatting complete!"