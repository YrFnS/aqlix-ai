#!/bin/bash
# Iraqi AI Chat System - Unified Formatting Hook
# Handles all file formatting (Python, TypeScript, JavaScript, CSS, JSON, Markdown)

set -e

echo "🎨 Running unified formatting..."

# Get all modified Python files and format them
if command -v python >/dev/null 2>&1 && python -m ruff --version >/dev/null 2>&1; then
    echo "🐍 Formatting Python files..."
    find . -name "*.py" -not -path "./.git/*" -not -path "./node_modules/*" -not -path "./.venv/*" -exec python -m ruff format {} \; 2>/dev/null || true
    echo "✅ Python formatting complete"
else
    echo "ℹ️  Install ruff for Python formatting"
fi

# Format frontend files if package.json exists
if [[ -f "package.json" ]] && command -v npx >/dev/null 2>&1; then
    echo "⚛️  Formatting frontend files..."
    npx prettier --write "**/*.{ts,tsx,js,jsx,json,md,css,scss,yml,yaml}" 2>/dev/null || true
    echo "✅ Frontend formatting complete"
else
    echo "ℹ️  Frontend formatting skipped (no package.json or prettier)"
fi

echo "✅ Unified formatting complete!"