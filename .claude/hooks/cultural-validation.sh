#!/bin/bash
# Iraqi AI Chat System - Cultural Validation Hook
# Runs when Claude finishes responding to validate Islamic compliance

set -e

echo "🕌 Running Iraqi cultural validation..."

# Get project root
PROJECT_ROOT="$CLAUDE_PROJECT_DIR"
cd "$PROJECT_ROOT"

# Track validation results
CULTURAL_SCORE=100
ISSUES_FOUND=0

# Function to check cultural compliance
validate_content() {
    local file_path="$1"
    
    if [[ ! -f "$file_path" ]]; then
        return 0
    fi
    
    echo "📋 Validating: $(basename "$file_path")"
    
    # Check for potentially problematic content
    local problematic_patterns=(
        "interest.*rate"
        "alcohol"
        "gambling"
        "inappropriate.*content"
        "sectarian"
        "political.*party"
    )
    
    for pattern in "${problematic_patterns[@]}"; do
        if grep -i "$pattern" "$file_path" >/dev/null 2>&1; then
            echo "⚠️  Potential cultural concern: $pattern"
            CULTURAL_SCORE=$((CULTURAL_SCORE - 10))
            ISSUES_FOUND=$((ISSUES_FOUND + 1))
        fi
    done
    
    # Check for positive Islamic values
    local positive_patterns=(
        "halal"
        "Islamic.*compliant"
        "cultural.*appropriate"
        "respectful"
        "family.*friendly"
    )
    
    for pattern in "${positive_patterns[@]}"; do
        if grep -i "$pattern" "$file_path" >/dev/null 2>&1; then
            echo "✅ Islamic compliance indicator found: $pattern"
        fi
    done
    
    # Check Arabic RTL support
    if [[ "$file_path" =~ \.(tsx?|jsx?)$ ]]; then
        if grep -q "dir.*rtl\|rtl.*dir" "$file_path"; then
            echo "✅ RTL support detected"
        elif grep -q "arabic\|Arabic" "$file_path"; then
            echo "⚠️  Arabic content without RTL support"
            CULTURAL_SCORE=$((CULTURAL_SCORE - 5))
            ISSUES_FOUND=$((ISSUES_FOUND + 1))
        fi
    fi
}

# Check recent changes for cultural compliance
if command -v git >/dev/null 2>&1 && git rev-parse --git-dir >/dev/null 2>&1; then
    # Check staged and modified files
    while IFS= read -r -d '' file; do
        validate_content "$file"
    done < <(git diff --cached --name-only -z 2>/dev/null || true)
    
    while IFS= read -r -d '' file; do
        validate_content "$file"
    done < <(git diff --name-only -z 2>/dev/null || true)
fi

# Check if cultural validation agent decisions exist
if [[ -f "$PROJECT_ROOT/project-context/agents/knowledge-base/cultural-decisions.md" ]]; then
    echo "📚 Cultural decisions knowledge base found"
    
    # Update cultural score based on established patterns
    if grep -q "95-100%" "$PROJECT_ROOT/project-context/agents/knowledge-base/cultural-decisions.md"; then
        echo "✅ High cultural compliance standards maintained"
    fi
fi

# Cultural compliance scoring
echo ""
echo "🎯 Cultural Validation Results:"
echo "   Basic Pattern Score: $CULTURAL_SCORE%"
echo "   Pattern Issues Found: $ISSUES_FOUND"

if [[ $CULTURAL_SCORE -ge 95 ]]; then
    echo "✅ Basic patterns look good"
elif [[ $CULTURAL_SCORE -ge 85 ]]; then
    echo "⚠️  Minor pattern concerns detected"
elif [[ $CULTURAL_SCORE -ge 70 ]]; then
    echo "⚠️  Pattern concerns - detailed review recommended"
else
    echo "❌ Multiple pattern issues - detailed analysis needed"
fi

# Recommendations - Emphasize sub-agent use
if [[ $ISSUES_FOUND -gt 0 ]]; then
    echo ""
    echo "💡 Next Steps:"
    echo "   - Use iraqi-cultural-validator sub-agent for detailed analysis"
    echo "   - Sub-agent provides context-aware cultural validation"
    echo "   - Hook patterns are basic - sub-agent has full Iraqi expertise"
    echo "   - Check project-context/cultural-decisions.md for established patterns"
fi

echo "🕌 Cultural validation complete"