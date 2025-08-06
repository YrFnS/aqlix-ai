#!/bin/bash
# Iraqi AI Chat System - Python Formatting Hook
# Handles FastAPI backend Python formatting and linting

set -e

echo "🐍 Running Python formatting..."

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

# Function to format Python files
format_py_file() {
    local file="$1"
    
    # Only process Python files
    if [[ ! "$file" =~ \.py$ ]]; then
        return 0
    fi
    
    if [[ ! -f "$file" ]]; then
        return 0
    fi
    
    echo "📝 Formatting: $(basename "$file")"
    
    # Check if Python is available
    if ! command -v python3 >/dev/null 2>&1 && ! command -v python >/dev/null 2>&1; then
        echo "⚠️  Python not found - skipping formatting"
        return 0
    fi
    
    # Use python3 if available, otherwise python
    PYTHON_CMD="python3"
    if ! command -v python3 >/dev/null 2>&1; then
        PYTHON_CMD="python"
    fi
    
    # Format with Ruff (modern Python formatter)
    if $PYTHON_CMD -m ruff --version >/dev/null 2>&1; then
        if $PYTHON_CMD -m ruff format "$file" >/dev/null 2>&1; then
            echo "✅ Formatted with Ruff"
        else
            echo "⚠️  Ruff formatting failed"
        fi
        
        # Ruff linting and auto-fix
        if $PYTHON_CMD -m ruff check --fix "$file" >/dev/null 2>&1; then
            echo "✅ Ruff linting passed"
        else
            echo "⚠️  Ruff linting issues detected"
        fi
    else
        # Fall back to Black if available
        if $PYTHON_CMD -m black --version >/dev/null 2>&1; then
            if $PYTHON_CMD -m black "$file" >/dev/null 2>&1; then
                echo "✅ Formatted with Black"
            else
                echo "⚠️  Black formatting failed"
            fi
        else
            echo "ℹ️  No Python formatter installed (install ruff or black)"
        fi
        
        # Fall back to flake8 for linting
        if $PYTHON_CMD -m flake8 --version >/dev/null 2>&1; then
            if $PYTHON_CMD -m flake8 "$file" >/dev/null 2>&1; then
                echo "✅ Flake8 linting passed"
            else
                echo "⚠️  Flake8 linting issues detected"
            fi
        fi
    fi
    
    # Type checking with mypy if available
    if $PYTHON_CMD -m mypy --version >/dev/null 2>&1; then
        if $PYTHON_CMD -m mypy "$file" >/dev/null 2>&1; then
            echo "✅ mypy type check passed"
        else
            echo "⚠️  mypy type issues detected"
        fi
    fi
    
    # Check for security issues with bandit if available
    if $PYTHON_CMD -m bandit --version >/dev/null 2>&1; then
        if $PYTHON_CMD -m bandit -q "$file" >/dev/null 2>&1; then
            echo "✅ Security check passed"
        else
            echo "⚠️  Security issues detected"
        fi
    fi
    
    # Check for PydanticAI patterns (Iraqi AI specific)
    if grep -q "pydantic_ai\|PydanticAI" "$file" 2>/dev/null; then
        echo "🤖 PydanticAI agent detected"
        
        # Check for proper environment variable loading
        if ! grep -q "load_dotenv()" "$file"; then
            echo "⚠️  Missing load_dotenv() - add for API key security"
        else
            echo "✅ Environment loading detected"
        fi
    fi
    
    # Check for Arabic content processing
    if grep -q "arabic\|Arabic\|rtl\|RTL" "$file" 2>/dev/null; then
        echo "🔍 Arabic processing code detected"
    fi
}

# Process specific file or recent changes
if [[ -n "$FILE_PATH" ]]; then
    format_py_file "$FILE_PATH"
else
    # Check recent git changes for Python files
    if command -v git >/dev/null 2>&1 && git rev-parse --git-dir >/dev/null 2>&1; then
        while IFS= read -r -d '' file; do
            format_py_file "$file"
        done < <(git diff --cached --name-only -z -- '*.py' 2>/dev/null || true)
        
        while IFS= read -r -d '' file; do
            format_py_file "$file"
        done < <(git diff --name-only -z -- '*.py' 2>/dev/null || true)
    fi
fi

echo "🐍 Python formatting complete"