#!/bin/bash
# Iraqi AI Chat System - Security Scanner Hook
# Scans for vulnerabilities, secrets, and security issues

FILE="$CLAUDE_TOOL_FILE_PATH"

# Skip if no file path
if [ -z "$FILE" ]; then
  exit 0
fi

# Track failures
FAILURES=0

# Run semgrep if available
if command -v semgrep >/dev/null 2>&1; then
  echo "🔍 Running semgrep security scan..."
  if ! semgrep --config=auto "$FILE" 2>&1; then
    FAILURES=$((FAILURES + 1))
  fi
fi

# Run bandit for Python files
if command -v bandit >/dev/null 2>&1; then
  case "$FILE" in
    *.py)
      echo "🔍 Running bandit Python security scan..."
      if ! bandit "$FILE" 2>&1; then
        FAILURES=$((FAILURES + 1))
      fi
      ;;
  esac
fi

# Check for hardcoded secrets
if grep -qE '(password|secret|key|token)\s*=\s*["'"'"'][^"'"'"'\n]{8,}' "$FILE" 2>/dev/null; then
  echo "⚠️  Warning: Potential hardcoded secrets detected in $FILE"
  FAILURES=$((FAILURES + 1))
fi

# Exit with failure count
if [ $FAILURES -gt 0 ]; then
  echo "❌ Security scan found $FAILURES issue(s)"
  exit 1
fi

echo "✅ Security scan passed"
exit 0
