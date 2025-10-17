#!/bin/bash
# Iraqi AI Chat System - Security Scanner Hook
# Scans for vulnerabilities, secrets, and security issues

FILE="$CLAUDE_TOOL_FILE_PATH"

# Skip if no file path
if [ -z "$FILE" ]; then
  exit 0
fi

# Run semgrep if available
if command -v semgrep >/dev/null 2>&1; then
  semgrep --config=auto "$FILE" 2>/dev/null || true
fi

# Run bandit for Python files
if command -v bandit >/dev/null 2>&1; then
  case "$FILE" in
    *.py) bandit "$FILE" 2>/dev/null || true ;;
  esac
fi

# Check for hardcoded secrets
if grep -qE '(password|secret|key|token)\s*=\s*["'"'"'][^"'"'"'\n]{8,}' "$FILE" 2>/dev/null; then
  echo "⚠️  Warning: Potential hardcoded secrets detected in $FILE"
fi

exit 0
