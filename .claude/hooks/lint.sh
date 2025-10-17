#!/bin/bash
# Iraqi AI Chat System - Monorepo Linting Hook
# Handles all file linting across the entire monorepo (Python, TypeScript, JavaScript)

echo "🔍 Running monorepo-wide linting..."

# Track linting results
ISSUES_FOUND=0

# Lint Python files in apps/api
if [[ -d "apps/api" ]]; then
    echo "🐍 Linting Python files (apps/api)..."
    if (cd apps/api && ruff check . 2>&1 | grep -q "All checks passed"); then
        echo "✅ Ruff linting passed"
    else
        echo "⚠️  Ruff issues detected in apps/api"
        ISSUES_FOUND=$((ISSUES_FOUND + 1))
    fi
fi

# Lint all TypeScript/JavaScript packages with Bun workspace
echo "⚛️  Linting TypeScript/JavaScript files (monorepo-wide)..."

# Run ESLint across all workspaces that have lint script
if bun run lint >/dev/null 2>&1; then
    echo "✅ ESLint passed (all workspaces)"
else
    echo "⚠️  ESLint issues detected"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

# Run TypeScript check across all workspaces that have typecheck script
if bun run typecheck >/dev/null 2>&1; then
    echo "✅ TypeScript check passed (all workspaces)"
else
    echo "⚠️  TypeScript issues detected"
    ISSUES_FOUND=$((ISSUES_FOUND + 1))
fi

echo ""
if [[ $ISSUES_FOUND -eq 0 ]]; then
    echo "✅ All linting checks passed!"
else
    echo "⚠️  $ISSUES_FOUND linting issues found"
    echo "💡 Run 'bun run lint' and 'bun run typecheck' from root for details"
fi

echo "🔍 Monorepo linting complete!"