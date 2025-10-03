#!/bin/bash
# Iraqi AI Chat System - Unified Formatting Hook
# Handles all file formatting (Python, TypeScript, JavaScript, CSS, JSON, Markdown)

set -e

echo "🎨 Running unified formatting..."

# Format Python files in apps/api
if [[ -d "apps/api" ]]; then
    echo "🐍 Formatting Python files..."
    (cd apps/api && ruff format . 2>/dev/null) || true
    echo "✅ Python formatting complete"
fi

# Format frontend files in apps/web
if [[ -d "apps/web" ]] && command -v bun >/dev/null 2>&1; then
    echo "⚛️  Formatting frontend files..."
    (cd apps/web && bun x prettier --write "src/**/*.{ts,tsx,js,jsx,json,css,scss}" 2>/dev/null) || true
    echo "✅ Frontend formatting complete"
fi

echo "✅ Unified formatting complete!"