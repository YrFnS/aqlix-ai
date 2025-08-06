#!/bin/bash
# Iraqi AI Chat System - Language-Specific Formatting Router
# Routes to appropriate formatter based on file extension

set -e

echo "🔧 Running language-specific formatting..."

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

# Function to determine file type and route to appropriate formatter
route_formatter() {
    local file="$1"
    
    if [[ ! -f "$file" ]]; then
        echo "⚠️  File not found: $file"
        return 0
    fi
    
    echo "📁 Processing: $file"
    
    # Route based on file extension
    case "$file" in
        *.py)
            echo "🐍 Python file detected"
            "$PROJECT_ROOT/.claude/hooks/format-python.sh" "$file"
            ;;
        *.ts|*.tsx|*.js|*.jsx)
            echo "⚛️  TypeScript/JavaScript file detected"
            "$PROJECT_ROOT/.claude/hooks/format-typescript.sh" "$file"
            ;;
        *.json|*.md|*.yml|*.yaml)
            echo "📄 Document file detected"
            # Use Prettier for JSON, Markdown, YAML if available
            if command -v npx >/dev/null 2>&1 && [[ -f "package.json" ]]; then
                if npm list prettier --depth=0 >/dev/null 2>&1; then
                    if npx prettier --write "$file" >/dev/null 2>&1; then
                        echo "✅ Formatted with Prettier"
                    else
                        echo "⚠️  Prettier formatting failed"
                    fi
                else
                    echo "ℹ️  Prettier not installed"
                fi
            fi
            ;;
        *.css|*.scss|*.sass)
            echo "🎨 Style file detected"
            # Use Prettier for CSS if available
            if command -v npx >/dev/null 2>&1 && [[ -f "package.json" ]]; then
                if npm list prettier --depth=0 >/dev/null 2>&1; then
                    if npx prettier --write "$file" >/dev/null 2>&1; then
                        echo "✅ CSS formatted with Prettier"
                    else
                        echo "⚠️  CSS formatting failed"
                    fi
                fi
            fi
            ;;
        *)
            echo "ℹ️  Unknown file type - skipping formatting"
            ;;
    esac
}

# Process specific file or recent changes
if [[ -n "$FILE_PATH" ]]; then
    route_formatter "$FILE_PATH"
else
    # Check recent git changes
    if command -v git >/dev/null 2>&1 && git rev-parse --git-dir >/dev/null 2>&1; then
        echo "🔍 Checking recent git changes..."
        
        # Process staged files
        while IFS= read -r -d '' file; do
            route_formatter "$file"
        done < <(git diff --cached --name-only -z 2>/dev/null || true)
        
        # Process modified files
        while IFS= read -r -d '' file; do
            route_formatter "$file"
        done < <(git diff --name-only -z 2>/dev/null || true)
    else
        echo "ℹ️  No git repository or specific file - skipping"
    fi
fi

echo ""
echo "✅ Language-specific formatting complete!"
echo "📊 Supported formats:"
echo "   🐍 Python (.py) → Ruff/Black + linting"  
echo "   ⚛️  TypeScript/JS (.ts/.tsx/.js/.jsx) → Prettier + ESLint"
echo "   📄 JSON/MD/YAML → Prettier"
echo "   🎨 CSS/SCSS → Prettier"