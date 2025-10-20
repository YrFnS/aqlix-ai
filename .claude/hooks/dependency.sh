#!/bin/bash
# Iraqi AI Chat System - Dependency Checker Hook
# Checks for security vulnerabilities in dependency files

FILE="$CLAUDE_TOOL_FILE_PATH"

# Skip if no file path
if [ -z "$FILE" ]; then
  exit 0
fi

# Track failures
FAILURES=0

# Check if it's a dependency file
case "$FILE" in
  *package.json)
    echo "📦 Dependency file modified: $FILE"
    if command -v npm >/dev/null 2>&1; then
      echo "🔍 Running npm audit..."
      if ! npm audit --audit-level=high 2>&1; then
        echo "⚠️  High/critical vulnerabilities found in npm dependencies"
        FAILURES=$((FAILURES + 1))
      fi
    fi
    ;;
  *requirements.txt)
    echo "📦 Dependency file modified: $FILE"
    if command -v safety >/dev/null 2>&1; then
      echo "🔍 Running safety check..."
      if ! safety check -r "$FILE" 2>&1; then
        echo "⚠️  Vulnerabilities found in Python dependencies"
        FAILURES=$((FAILURES + 1))
      fi
    fi
    ;;
esac

# Exit with failure count
if [ $FAILURES -gt 0 ]; then
  echo "❌ Dependency check found $FAILURES issue(s)"
  exit 1
fi

echo "✅ Dependency check passed"
exit 0
