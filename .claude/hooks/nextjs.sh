#!/bin/bash
# Iraqi AI Chat System - Next.js Code Quality Enforcer Hook
# Validates Next.js patterns and best practices (simplified for Windows compatibility)

# Read stdin (tool input/output from Claude Code)
input=$(cat)

# Extract file path using jq
FILE_PATH=$(echo "$input" | jq -r ".tool_input.file_path // empty" 2>/dev/null)
SUCCESS=$(echo "$input" | jq -r ".tool_response.success // false" 2>/dev/null)

# Skip if operation failed or no file path
if [ "$SUCCESS" != "true" ] || [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Only check JS/TS files (not in node_modules)
case "$FILE_PATH" in
  *.js|*.jsx|*.ts|*.tsx)
    if [[ "$FILE_PATH" == *node_modules* ]]; then
      exit 0
    fi
    ;;
  *)
    exit 0
    ;;
esac

# Check if file exists
if [ ! -f "$FILE_PATH" ]; then
  exit 0
fi

echo "🔍 Next.js Code Quality: Reviewing $FILE_PATH..."

# Check for App Router patterns
case "$FILE_PATH" in
  *app/*)
    echo "📁 App Router file detected"

    # Check page components
    if [[ "$FILE_PATH" == *page.* ]]; then
      if ! grep -q "export default function" "$FILE_PATH" 2>/dev/null && \
         ! grep -q "export default async function" "$FILE_PATH" 2>/dev/null; then
        echo "⚠️  Page component should export default function"
      fi
    fi

    # Check for client vs server components
    if grep -q "use client" "$FILE_PATH" 2>/dev/null; then
      echo "🖥️  Client Component"
    else
      echo "🚀 Server Component"
    fi
    ;;
esac

# Check for Next.js optimizations
if grep -q "next/image" "$FILE_PATH" 2>/dev/null; then
  echo "✅ Using next/image"
elif grep -q "<img" "$FILE_PATH" 2>/dev/null; then
  echo "💡 Consider using next/image for better performance"
fi

if grep -q "next/link" "$FILE_PATH" 2>/dev/null; then
  echo "✅ Using next/link"
fi

echo "✅ Code quality check complete"
exit 0
