#!/bin/bash
# Iraqi AI Chat System - Unified Linting Hook
# Handles all file linting (Python, TypeScript, JavaScript)

set -e

echo "🔍 Running unified linting..."

# Track linting results
ISSUES_FOUND=0

# Lint Python files in apps/api
if [[ -d "apps/api" ]]; then
    echo "🐍 Linting Python files..."
    if (cd apps/api && ruff check . 2>&1 | grep -q "All checks passed"); then
        echo "✅ Ruff linting passed"
    else
        echo "⚠️  Ruff issues detected"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi
fi

# Lint frontend files in apps/web
if [[ -d "apps/web" ]]; then
    echo "⚛️  Linting frontend files..."

    # ESLint
    if (cd apps/web && bun run lint >/dev/null 2>&1); then
        echo "✅ ESLint passed"
    else
        echo "⚠️  ESLint issues detected"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi

    # TypeScript check
    if (cd apps/web && bun run typecheck >/dev/null 2>&1); then
        echo "✅ TypeScript check passed"
    else
        echo "⚠️  TypeScript issues detected"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi
fi

echo ""
if [[ $ISSUES_FOUND -eq 0 ]]; then
    echo "✅ All linting checks passed!"
else
    echo "⚠️  $ISSUES_FOUND linting issues found"
    echo "💡 Run 'bun run lint' and 'bun run typecheck' in apps/web for details"
fi

echo "🔍 Unified linting complete!"