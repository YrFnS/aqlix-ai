#!/bin/bash
# Iraqi AI Chat System - TypeScript/JavaScript Formatting Hook
# Handles Next.js 15+ frontend formatting and linting

set -e

echo "⚛️  Running TypeScript/JavaScript formatting..."

# Get project root and file info from hook input
PROJECT_ROOT="$CLAUDE_PROJECT_DIR"
cd "$PROJECT_ROOT"

# Parse hook input JSON for file path
FILE_PATH=""
if [[ -n "$1" ]]; then
    FILE_PATH="$1"
elif [[ ! -t 0 ]]; then
    # Read from stdin if available (hook input)
    HOOK_INPUT=$(cat)
    FILE_PATH=$(echo "$HOOK_INPUT" | grep -o '"file_path":[^,}]*' | cut -d'"' -f4 2>/dev/null || echo "")
fi

# Function to format TypeScript/JavaScript files
format_ts_file() {
    local file="$1"
    
    # Only process TS/JS files
    if [[ ! "$file" =~ \.(ts|tsx|js|jsx)$ ]]; then
        return 0
    fi
    
    if [[ ! -f "$file" ]]; then
        return 0
    fi
    
    echo "📝 Formatting: $(basename "$file")"
    
    # Check if we're in a Node.js project
    if [[ ! -f "package.json" ]]; then
        echo "⚠️  No package.json found - skipping npm commands"
        return 0
    fi
    
    # Run Prettier formatting if available
    if npm list prettier --depth=0 >/dev/null 2>&1; then
        if npx prettier --write "$file" >/dev/null 2>&1; then
            echo "✅ Formatted with Prettier"
        else
            echo "⚠️  Prettier formatting failed"
        fi
    else
        echo "ℹ️  Prettier not installed"
    fi
    
    # Run ESLint if available
    if npm list eslint --depth=0 >/dev/null 2>&1; then
        if npx eslint --fix "$file" >/dev/null 2>&1; then
            echo "✅ ESLint auto-fix applied"
        else
            echo "⚠️  ESLint issues detected"
        fi
    else
        echo "ℹ️  ESLint not installed"
    fi
    
    # TypeScript type checking
    if [[ "$file" =~ \.(ts|tsx)$ ]] && command -v npx >/dev/null 2>&1; then
        if npx tsc --noEmit --skipLibCheck >/dev/null 2>&1; then
            echo "✅ TypeScript check passed"
        else
            echo "⚠️  TypeScript errors detected"
        fi
    fi
    
    # Check for Arabic content without RTL support
    if grep -q '[\u0600-\u06FF]' "$file" 2>/dev/null; then
        if ! grep -q 'dir.*rtl\|rtl.*dir\|direction.*rtl' "$file"; then
            echo "⚠️  Arabic content detected - ensure RTL support"
        else
            echo "✅ Arabic RTL support detected"
        fi
    fi
}

# Process specific file or recent changes
if [[ -n "$FILE_PATH" ]]; then
    format_ts_file "$FILE_PATH"
else
    # Check recent git changes for TS/JS files
    if command -v git >/dev/null 2>&1 && git rev-parse --git-dir >/dev/null 2>&1; then
        while IFS= read -r -d '' file; do
            format_ts_file "$file"
        done < <(git diff --cached --name-only -z -- '*.ts' '*.tsx' '*.js' '*.jsx' 2>/dev/null || true)
        
        while IFS= read -r -d '' file; do
            format_ts_file "$file"
        done < <(git diff --name-only -z -- '*.ts' '*.tsx' '*.js' '*.jsx' 2>/dev/null || true)
    fi
fi

echo "⚛️  TypeScript/JavaScript formatting complete"