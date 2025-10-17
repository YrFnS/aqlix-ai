#!/bin/bash
# Iraqi AI Chat System - Dependency Checker Hook
# Checks for security vulnerabilities in dependency files

FILE="$CLAUDE_TOOL_FILE_PATH"

# Skip if no file path
if [ -z "$FILE" ]; then
  exit 0
fi

# Check if it's a dependency file
case "$FILE" in
  *package.json)
    echo "📦 Dependency file modified: $FILE"
    if command -v npm >/dev/null 2>&1; then
      npm audit 2>/dev/null || true
    fi
    ;;
  *requirements.txt)
    echo "📦 Dependency file modified: $FILE"
    if command -v safety >/dev/null 2>&1; then
      safety check -r "$FILE" 2>/dev/null || true
    fi
    ;;
esac

exit 0
