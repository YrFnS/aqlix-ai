#!/bin/bash
# Iraqi AI Chat System - Unified Linting Hook
# Handles all file linting (Python, TypeScript, JavaScript)

set -e

echo "🔍 Running unified linting..."

# Get project root
PROJECT_ROOT="$CLAUDE_PROJECT_DIR"
cd "$PROJECT_ROOT"

# Parse Claude Code hook JSON input from stdin
FILE_PATH=""
if [[ ! -t 0 ]]; then
    # Read JSON from stdin (Claude Code hook format)
    HOOK_INPUT=$(cat)
    FILE_PATH=$(echo "$HOOK_INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null || echo "")
fi

# Track linting results
ISSUES_FOUND=0

# Function to lint any file based on extension
lint_file() {
    local file="$1"
    
    if [[ ! -f "$file" ]]; then
        return 0
    fi
    
    echo "🔍 Linting: $(basename "$file")"
    
    case "$file" in
        *.py)
            echo "🐍 Python linting"
            
            # Ruff linting (modern Python linter)
            if command -v python3 >/dev/null 2>&1 && python3 -m ruff --version >/dev/null 2>&1; then
                if python3 -m ruff check --fix "$file" >/dev/null 2>&1; then
                    echo "✅ Ruff linting passed"
                else
                    echo "⚠️  Ruff issues detected"
                    ISSUES_FOUND=$((ISSUES_FOUND + 1))
                fi
            elif command -v python >/dev/null 2>&1 && python -m ruff --version >/dev/null 2>&1; then
                if python -m ruff check --fix "$file" >/dev/null 2>&1; then
                    echo "✅ Ruff linting passed"
                else
                    echo "⚠️  Ruff issues detected"
                    ISSUES_FOUND=$((ISSUES_FOUND + 1))
                fi
            else
                echo "ℹ️  Install ruff for Python linting"
            fi
            
            # Check for Iraqi AI specific patterns
            if grep -q "pydantic_ai\|PydanticAI" "$file" 2>/dev/null; then
                echo "🤖 PydanticAI agent detected"
                if ! grep -q "load_dotenv()" "$file"; then
                    echo "⚠️  Missing load_dotenv() - add for API key security"
                    ISSUES_FOUND=$((ISSUES_FOUND + 1))
                fi
            fi
            ;;
        *.ts|*.tsx|*.js|*.jsx)
            echo "⚛️  Frontend linting"
            
            # ESLint for TypeScript/JavaScript
            if [[ -f "package.json" ]] && command -v npx >/dev/null 2>&1; then
                if npx eslint --fix "$file" >/dev/null 2>&1; then
                    echo "✅ ESLint passed"
                else
                    echo "⚠️  ESLint issues detected"
                    ISSUES_FOUND=$((ISSUES_FOUND + 1))
                fi
            fi
            
            # TypeScript check
            if [[ "$file" =~ \.tsx?$ ]] && [[ -f "tsconfig.json" ]]; then
                if npx tsc --noEmit --skipLibCheck "$file" >/dev/null 2>&1; then
                    echo "✅ TypeScript check passed"
                else
                    echo "⚠️  TypeScript issues detected"
                    ISSUES_FOUND=$((ISSUES_FOUND + 1))
                fi
            fi
            
            # Check for Arabic/RTL support in React components
            if [[ "$file" =~ \.(tsx|jsx)$ ]] && grep -q "arabic\|Arabic" "$file" 2>/dev/null; then
                if ! grep -q "dir.*rtl\|rtl.*dir" "$file"; then
                    echo "⚠️  Arabic content without RTL support"
                    ISSUES_FOUND=$((ISSUES_FOUND + 1))
                fi
            fi
            ;;
        *)
            return 0
            ;;
    esac
}

# Process file from Claude Code hook input
if [[ -n "$FILE_PATH" ]]; then
    lint_file "$FILE_PATH"
else
    echo "ℹ️  No file path in hook input - skipping linting"
fi

echo ""
if [[ $ISSUES_FOUND -eq 0 ]]; then
    echo "✅ All linting checks passed!"
else
    echo "⚠️  $ISSUES_FOUND linting issues found"
    echo "💡 Run 'bun run lint' and 'bun run typecheck' for details"
fi

echo "🔍 Unified linting complete!"