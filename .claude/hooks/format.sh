#!/bin/bash
# Iraqi AI Chat System - Unified Formatting Hook
# Handles all file formatting (Python, TypeScript, JavaScript, CSS, JSON, Markdown)

set -e

echo "🎨 Running unified formatting..."

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

# Function to format any file based on extension
format_file() {
    local file="$1"
    
    if [[ ! -f "$file" ]]; then
        return 0
    fi
    
    echo "📝 Formatting: $(basename "$file")"
    
    case "$file" in
        *.py)
            echo "🐍 Python formatting"
            # Use Ruff (modern Python formatter)
            if command -v python3 >/dev/null 2>&1 && python3 -m ruff --version >/dev/null 2>&1; then
                python3 -m ruff format "$file" >/dev/null 2>&1 && echo "✅ Ruff formatted"
            elif command -v python >/dev/null 2>&1 && python -m ruff --version >/dev/null 2>&1; then
                python -m ruff format "$file" >/dev/null 2>&1 && echo "✅ Ruff formatted"
            else
                echo "ℹ️  Install ruff for Python formatting"
            fi
            ;;
        *.ts|*.tsx|*.js|*.jsx|*.json|*.md|*.css|*.scss|*.yml|*.yaml)
            echo "⚛️  Frontend/document formatting"
            # Use Prettier for everything web-related
            if [[ -f "package.json" ]] && command -v npx >/dev/null 2>&1; then
                if npx prettier --write "$file" >/dev/null 2>&1; then
                    echo "✅ Prettier formatted"
                else
                    echo "ℹ️  Install prettier for formatting"
                fi
            fi
            ;;
        *)
            echo "ℹ️  Unknown file type - skipping"
            ;;
    esac
}

# Process file from Claude Code hook input
if [[ -n "$FILE_PATH" ]]; then
    format_file "$FILE_PATH"
else
    echo "ℹ️  No file path in hook input - skipping formatting"
fi

echo "✅ Unified formatting complete!"