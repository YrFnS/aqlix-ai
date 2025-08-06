#!/bin/bash
# Iraqi AI Chat System - Context Loading Hook
# Runs at session start to load relevant Iraqi context

set -e

echo "🚀 Loading Iraqi AI context..."

# Get project root
PROJECT_ROOT="$CLAUDE_PROJECT_DIR"
cd "$PROJECT_ROOT"

# Check if this is an Iraqi AI project
if [[ ! -f "CLAUDE.md" ]] || ! grep -q "Iraqi AI Chat System" "CLAUDE.md" 2>/dev/null; then
    echo "ℹ️  Not an Iraqi AI project - skipping context load"
    exit 0
fi

echo "🇮🇶 Iraqi AI Chat System detected"

# Load current context
if [[ -f "$PROJECT_ROOT/project-context/current-context.md" ]]; then
    echo "📋 Current context available"
    CONTEXT_DATE=$(grep "Session Date" "$PROJECT_ROOT/project-context/current-context.md" || echo "Unknown")
    echo "   $CONTEXT_DATE"
fi

# Check agent status
if [[ -d "$PROJECT_ROOT/.claude/agents" ]]; then
    AGENT_COUNT=$(find "$PROJECT_ROOT/.claude/agents" -name "*.md" | wc -l)
    echo "🤖 $AGENT_COUNT specialized agents available"
fi

# Check knowledge base status
if [[ -d "$PROJECT_ROOT/project-context/agents/knowledge-base" ]]; then
    KB_FILES=$(find "$PROJECT_ROOT/project-context/agents/knowledge-base" -name "*.md" | wc -l)
    echo "📚 $KB_FILES knowledge base files loaded"
    
    # Show recent cultural decisions
    if [[ -f "$PROJECT_ROOT/project-context/agents/knowledge-base/cultural-decisions.md" ]]; then
        RECENT_DECISIONS=$(tail -n 5 "$PROJECT_ROOT/project-context/agents/knowledge-base/cultural-decisions.md" | grep -c "Decision:" || echo "0")
        echo "   Recent cultural decisions: $RECENT_DECISIONS"
    fi
fi

# Check tech stack status
echo ""
echo "⚙️  Tech Stack Status:"

# Check package.json for dependencies
if [[ -f "package.json" ]]; then
    if grep -q "next" "package.json"; then
        echo "   ✅ Next.js 15+ (Frontend)"
    fi
    if grep -q "typescript" "package.json"; then
        echo "   ✅ TypeScript (Type Safety)"
    fi
fi

# Check Python setup
if [[ -f "apps/api/requirements.txt" ]] || [[ -f "apps/api/pyproject.toml" ]]; then
    echo "   ✅ Python FastAPI (Backend)"
    if grep -q "pydantic-ai" "apps/api/requirements.txt" 2>/dev/null; then
        echo "   ✅ PydanticAI (Agent Framework)"
    fi
fi

# Check for Iraqi-specific features
echo ""
echo "🎯 Iraqi Features Status:"

if find . -name "*.py" -o -name "*.ts" -o -name "*.tsx" | xargs grep -l "rtl\|RTL" >/dev/null 2>&1; then
    echo "   ✅ RTL Support implemented"
fi

if find . -name "*.py" -o -name "*.ts" -o -name "*.tsx" | xargs grep -l "arabic\|Arabic" >/dev/null 2>&1; then
    echo "   ✅ Arabic language support"
fi

if find . -name "*.py" -o -name "*.ts" -o -name "*.tsx" | xargs grep -l "ZainCash\|FastPay\|NassWallet" >/dev/null 2>&1; then
    echo "   ✅ Iraqi payment gateways"
fi

if find . -name "*.py" -o -name "*.ts" -o -name "*.tsx" | xargs grep -l "islamic\|Islamic\|halal" >/dev/null 2>&1; then
    echo "   ✅ Islamic compliance features"
fi

# Show available commands
echo ""
echo "📝 Available Commands:"
if [[ -f "package.json" ]]; then
    echo "   npm run dev      - Start development"
    echo "   npm run build    - Build for production"
    echo "   npm run test     - Run all tests"
    if grep -q "test:cultural" "package.json"; then
        echo "   npm run test:cultural - Cultural validation tests"
    fi
    if grep -q "test:arabic" "package.json"; then
        echo "   npm run test:arabic   - Arabic/RTL tests"
    fi
fi

echo ""
echo "🎯 Iraqi AI context loaded successfully!"
echo "💡 Use specialized agents for complex Iraqi AI tasks"