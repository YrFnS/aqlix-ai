#!/bin/bash
# Iraqi AI Chat System - Unified Linting Hook
# Handles all file linting (Python, TypeScript, JavaScript)

set -e

echo "🔍 Running unified linting..."

# Track linting results
ISSUES_FOUND=0

# Lint Python files
if command -v python >/dev/null 2>&1 && python -m ruff --version >/dev/null 2>&1; then
    echo "🐍 Linting Python files..."
    if python -m ruff check --fix . >/dev/null 2>&1; then
        echo "✅ Ruff linting passed"
    else
        echo "⚠️  Ruff issues detected"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi
else
    echo "ℹ️  Install ruff for Python linting"
fi

# Lint frontend files if package.json exists
if [[ -f "package.json" ]] && command -v npx >/dev/null 2>&1; then
    echo "⚛️  Linting frontend files..."

    # ESLint
    if npx eslint --fix "**/*.{ts,tsx,js,jsx}" >/dev/null 2>&1; then
        echo "✅ ESLint passed"
    else
        echo "⚠️  ESLint issues detected"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi

    # TypeScript check
    if [[ -f "tsconfig.json" ]]; then
        if npx tsc --noEmit >/dev/null 2>&1; then
            echo "✅ TypeScript check passed"
        else
            echo "⚠️  TypeScript issues detected"
            ISSUES_FOUND=$((ISSUES_FOUND + 1))
        fi
    fi
else
    echo "ℹ️  Frontend linting skipped (no package.json)"
fi

echo ""
if [[ $ISSUES_FOUND -eq 0 ]]; then
    echo "✅ All linting checks passed!"
else
    echo "⚠️  $ISSUES_FOUND linting issues found"
    echo "💡 Run 'bun run lint' and 'bun run typecheck' for details"
fi

echo "🔍 Unified linting complete!"