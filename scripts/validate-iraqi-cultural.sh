#!/bin/bash
# Iraqi Cultural Validation Script
# Validates cultural compliance, Islamic principles, and professional domain appropriateness

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

echo "🛡️  Starting Iraqi Cultural Validation..."

# Counter for violations
VIOLATIONS=0

# Function to report violation
report_violation() {
    echo "❌ Cultural Violation: $1"
    ((VIOLATIONS++))
}

# Function to report success
report_success() {
    echo "✅ $1"
}

# ============================================================================
# 1. Political Neutrality Check
# ============================================================================
echo ""
echo "🔍 Checking Political Neutrality..."

# Check for sectarian terms
if grep -r -i "sunni\|shi'a\|shia\|kurdish\|arab" "$PROJECT_ROOT/apps" --include="*.py" --include="*.ts" --include="*.tsx" | \
   grep -v "test" | grep -v ".next" | grep -v "node_modules" | \
   grep -v "iraqi" | grep -v "en-US" | grep -v "professional" | \
   grep -v "cultural" | grep -v "documentation" | \
   grep -v "validation" | grep -E "\b(sectarian|tribal|ethnic|religious extremism)" > /dev/null 2>&1; then
    report_violation "Sectarian, tribal, or extremist religious language detected"
else
    report_success "No sectarian language detected"
fi

# Check for political party references
if grep -r -i "party\|election\|campaign\|vote" "$PROJECT_ROOT/apps" --include="*.py" --include="*.ts" --include="*.tsx" | \
   grep -v "test" | grep -v ".next" | grep -v "node_modules" | \
   grep -v "email" | grep -v "database" | grep -v "policy" | \
   grep -v "validate" | grep -v "test" | \
   grep -E "\b(democracy|republic|regime|government|ministry)" > /dev/null 2>&1; then
    echo "⚠️  WARNING: Potential political language detected (review if necessary)"
else
    report_success "No explicit political language detected"
fi

# ============================================================================
# 2. Islamic Compliance Check
# ============================================================================
echo ""
echo "🕌 Checking Islamic Compliance..."

# Check for explicit Haram content
if grep -r -i "alcohol\|pork\|gambling\|interest\|riba" "$PROJECT_ROOT/apps" --include="*.py" --include="*.ts" --include="*.tsx" | \
   grep -v "test" | grep -v ".next" | grep -v "node_modules" | \
   grep -v "validation" | grep -v "example" | \
   grep -v "documentation" | grep -v "prevent" | \
   grep -v "avoid" | grep -v "forbidden" > /dev/null 2>&1; then
    report_violation "Potentially inappropriate content related to Islamic prohibitions"
else
    report_success "No explicit prohibited content found"
fi

# Check for prayer/greeting appropriateness
if grep -r "assalamu alaikum\|salam" "$PROJECT_ROOT/apps" --include="*.py" --include="*.ts" --include="*.tsx" | \
   grep -v "test" | grep -v ".next" | grep -v "node_modules" | \
   grep -v "validation" | grep -v "example" | \
   grep -v "documentation" > /dev/null 2>&1; then
    report_success "Islamic greetings used appropriately"
else
    echo "⚠️  INFO: Consider using Islamic greetings where culturally appropriate"
fi

# ============================================================================
# 3. Professional Domain Check
# ============================================================================
echo ""
echo "💼 Checking Professional Domain Compliance..."

# Check for appropriate professional terminology
PROFESSIONAL_TERMS_FILE="$PROJECT_ROOT/NAMING_CONVENTIONS.md"
if [ -f "$PROFESSIONAL_TERMS_FILE" ]; then
    report_success "NAMING_CONVENTIONS.md found"
else
    report_violation "NAMING_CONVENTIONS.md not found - required for professional domain compliance"
fi

# Check for appropriate use of Iraqi professional domains
if grep -r -i "legal\|medical\|educational\|engineering\|organizational" "$PROJECT_ROOT/packages" --include="*.ts" --include="*.py" | \
   grep -v "test" | grep -v "node_modules" > /dev/null 2>&1; then
    report_success "Professional domain terminology used"
else
    echo "⚠️  INFO: Professional domain terminology not found in packages"
fi

# ============================================================================
# 4. Arabic Text and RTL Support
# ============================================================================
echo ""
echo "🔤 Checking Arabic/RTL Support..."

# Check for Arabic text handling
if grep -r "arabic\|rtl\|right.*left" "$PROJECT_ROOT/apps" --include="*.ts" --include="*.tsx" | \
   grep -v "test" | grep -v "node_modules" > /dev/null 2>&1; then
    report_success "Arabic/RTL support detected"
else
    echo "⚠️  INFO: No explicit Arabic/RTL support detected"
fi

# Check for proper Arabic text handling in forms
if grep -r "font-arabic\|dir=rtl\|text-align.*right" "$PROJECT_ROOT/apps/web" --include="*.tsx" --include="*.ts" | \
   grep -v "test" | grep -v "node_modules" > /dev/null 2>&1; then
    report_success "RTL styling patterns detected"
else
    echo "⚠️  INFO: Consider adding RTL support for Arabic text"
fi

# ============================================================================
# 5. Cultural Sensitivity Check
# ============================================================================
echo ""
echo "🤝 Checking Cultural Sensitivity..."

# Check for respectful language
if grep -r -i "stupid\|idiot\|crazy" "$PROJECT_ROOT/apps" --include="*.py" --include="*.ts" --include="*.tsx" | \
   grep -v "test" | grep -v ".next" | grep -v "node_modules" | \
   grep -v "validation" | grep -v "error" > /dev/null 2>&1; then
    report_violation "Potentially disrespectful language detected"
else
    report_success "No disrespectful language detected"
fi

# Check for family-appropriate content
if grep -r -i "inappropriate\|offensive" "$PROJECT_ROOT/apps" --include="*.py" --include="*.ts" --include="*.tsx" | \
   grep -v "test" | grep -v ".next" | grep -v "node_modules" > /dev/null 2>&1; then
    echo "⚠️  INFO: Review for potentially inappropriate content"
else
    report_success "No explicit inappropriate content detected"
fi

# ============================================================================
# 6. Gender Appropriateness Check
# ============================================================================
echo ""
echo "👥 Checking Gender Appropriateness..."

# Check for inclusive language patterns
if grep -r "he/she\|his/her" "$PROJECT_ROOT/apps" --include="*.py" --include="*.ts" --include="*.tsx" | \
   grep -v "test" | grep -v ".next" | grep -v "node_modules" > /dev/null 2>&1; then
    echo "⚠️  INFO: Consider using gender-neutral language (they/them) where appropriate"
else
    report_success "Appropriate gender language or neutral alternatives"
fi

# ============================================================================
# Summary
# ============================================================================
echo ""
echo "========================================="
echo "📊 Cultural Validation Summary"
echo "========================================="

if [ $VIOLATIONS -eq 0 ]; then
    echo "✅ All cultural validation checks passed!"
    echo "✅ Cultural Compliance: 100%"
    echo ""
    exit 0
else
    echo "❌ Found $VIOLATIONS cultural violation(s)"
    echo "❌ Cultural Compliance: Below required threshold"
    echo ""
    echo "Please review and fix the violations above."
    exit 1
fi
