# Claude Code Hooks Setup

**Iraqi AI Chat System - Automated Development Workflow**

This document describes the automated hooks configured for quality, security, and productivity during development.

## Overview

Our hooks system combines:
- **Official aitmpl.com hooks** (security, Next.js quality)
- **Custom Iraqi AI hooks** (monorepo-aware formatting and linting)

## Hook Events

### 1. PreToolUse (Before Actions)

#### Update Search Year 📅
**Event**: `PreToolUse` → `WebSearch`
**Purpose**: Automatically adds current year (2025) to web searches

**What it does**:
- ✅ Adds "2025" to searches without explicit year
- ✅ Skips if query already has year (2020-2029)
- ✅ Skips if query has temporal words (latest, recent, current, new, now, today)
- ✅ Prevents getting stale 2024 results

**Example**:
```
"Next.js best practices" → "Next.js best practices 2025"
"React hooks tutorial" → "React hooks tutorial 2025"
"Latest TypeScript features" → "Latest TypeScript features" (skipped)
"Vue.js 2024 guide" → "Vue.js 2024 guide" (skipped)
```

---

### 2. PostToolUse (After Actions)

#### Security Scanner 🔒
**Event**: `PostToolUse` → `Edit|Write`
**Purpose**: Detect security vulnerabilities and secrets in code

**Tools Used**:
- **semgrep**: Static code analysis for security vulnerabilities
- **bandit**: Python-specific security linting
- **gitleaks**: Secret and credential detection
- **grep**: Hardcoded password/token detection

**What it catches**:
- SQL injection vulnerabilities
- XSS vulnerabilities
- Hardcoded API keys, passwords, tokens
- Insecure cryptography
- Command injection risks
- Path traversal issues

**Example Warning**:
```bash
Warning: Potential hardcoded secrets detected in apps/api/config.py
```

---

#### Dependency Checker 📦
**Event**: `PostToolUse` → `Edit`
**Purpose**: Check for vulnerable dependencies when dependency files change

**Triggers On**:
- `package.json` (npm/bun)
- `requirements.txt` (Python pip)
- `Cargo.toml` (Rust)

**Tools Used**:
- **npm audit**: Check for vulnerable npm packages
- **npm-check-updates**: Show available package updates
- **safety**: Python dependency security checker

**Example Output**:
```bash
Dependency file modified: apps/web/package.json
found 0 vulnerabilities
Checking for updates...
  @types/react  ^18.2.0  →  ^18.3.0
```

---

#### Next.js Code Quality Enforcer ⚛️
**Event**: `PostToolUse` → `Write|Edit|MultiEdit`
**Purpose**: Enforce Next.js App Router best practices

**What it checks**:

**App Router Patterns**:
- ✅ Page components export default function
- ✅ Layout components accept children prop
- ✅ Metadata exports for SEO
- ✅ Proper "use client" directive usage
- ✅ Server vs Client component validation

**Next.js Best Practices**:
- ✅ Use `next/image` instead of `<img>`
- ✅ Use `next/link` instead of `<a>` for internal links
- ✅ Warn about Pages Router patterns in App Router

**TypeScript Recommendations**:
- ✅ Suggest TypeScript for .js files
- ✅ Recommend React.FC for typed components
- ✅ Suggest clsx/classnames for dynamic classes

**Example Output**:
```bash
🔍 Next.js Code Quality Enforcer: Reviewing apps/web/src/app/page.tsx...
📁 App Router file detected: apps/web/src/app/page.tsx
🚀 Server Component (default)
✅ Using next/image for optimized images
✅ Using next/link for navigation
✅ Code quality check passed for apps/web/src/app/page.tsx
```

**Failures** (blocks commit):
```bash
❌ Interactive features in Server Component - add "use client" directive
❌ Found 1 code quality issues in apps/web/src/app/dashboard/page.tsx
```

---

#### Monorepo Formatting 🎨
**Event**: `PostToolUse` → `Edit|MultiEdit|Write`
**Purpose**: Auto-format all code files in monorepo

**Script**: `.claude/hooks/format.sh`

**What it formats**:
- **Python**: Ruff format (apps/api)
- **JavaScript/TypeScript/CSS/JSON/Markdown**: Prettier (all workspaces)
- **Monorepo-wide**: Formats apps/, packages/, and root files

**Example Output**:
```bash
🎨 Running monorepo-wide formatting...
🐍 Formatting Python files (apps/api)...
✅ Python formatting complete
⚛️  Formatting TypeScript/JavaScript/CSS/JSON files (monorepo-wide)...
✅ TypeScript/JavaScript/CSS/JSON formatting complete
✅ Monorepo formatting complete!
```

---

#### Monorepo Linting 🔍
**Event**: `PostToolUse` → `Edit|MultiEdit|Write`
**Purpose**: Lint and typecheck entire monorepo

**Script**: `.claude/hooks/lint.sh`

**What it checks**:
1. **Python**: Ruff linting (apps/api)
2. **ESLint**: All workspaces via `bun run lint`
3. **TypeScript**: All workspaces via `bun run typecheck`

**Build Order**:
- ✅ Builds packages first (before typecheck)
- ✅ Ensures .d.ts files are available
- ✅ Validates entire monorepo consistency

**Example Output**:
```bash
🔍 Running monorepo-wide linting...
🐍 Linting Python files (apps/api)...
✅ Ruff linting passed
⚛️  Linting TypeScript/JavaScript files (monorepo-wide)...
✅ ESLint passed (all workspaces)
✅ TypeScript check passed (all workspaces)
✅ All linting checks passed!
```

---

## Hook Execution Order

When you edit a file, hooks run in this order:

1. **Security Scanner** - Check for vulnerabilities/secrets
2. **Dependency Checker** - Check if dependency files changed
3. **Next.js Enforcer** - Validate Next.js patterns (JS/TS files only)
4. **Format** - Auto-format the file
5. **Lint** - Lint and typecheck entire monorepo

**⚠️ Non-Blocking Philosophy**:
- **All hooks warn but never block** edits
- Quality issues are reported, but edits always succeed
- Philosophy: Report problems, don't prevent progress
- Exit codes: All hooks exit with 0 (success) even when issues found

**Why Non-Blocking?**
- ✅ Keeps development flow uninterrupted
- ✅ Encourages fixing issues when ready
- ✅ Prevents frustration during rapid prototyping
- ✅ Issues still visible in hook output

---

## Installation Requirements

### Required (Core Functionality)
- ✅ **Python 3** - For search year hook
- ✅ **Bun** - Monorepo package manager
- ✅ **Prettier** - JavaScript/TypeScript formatting
- ✅ **ESLint** - JavaScript/TypeScript linting
- ✅ **Ruff** - Python formatting and linting

### Optional (Enhanced Security)
- **semgrep** - Static code analysis (optional)
- **bandit** - Python security linting (optional)
- **gitleaks** - Secret detection (optional)
- **npm-check-updates** - Dependency update checker (optional)
- **safety** - Python dependency security (optional)

### Installation Commands

**Core (Required)**:
```bash
# Already installed via package.json and apps/api/requirements.txt
bun install
pip install ruff
```

**Optional Security Tools**:
```bash
# Install semgrep
pip install semgrep

# Install bandit
pip install bandit

# Install gitleaks
brew install gitleaks  # macOS
# or
wget https://github.com/gitleaks/gitleaks/releases/latest/download/gitleaks_*_linux_x64.tar.gz  # Linux

# Install npm-check-updates
npm install -g npm-check-updates

# Install safety
pip install safety
```

---

## Configuration Files

### Team Configuration (Committed)
**File**: `.claude/settings.json`
**Purpose**: Hooks shared by entire team
**Version Control**: ✅ Committed to git

Contains:
- PreToolUse: Update Search Year
- PostToolUse: Security, Dependencies, Next.js, Format, Lint

### Personal Configuration (Not Committed)
**File**: `.claude/settings.local.json`
**Purpose**: Personal overrides and experiments
**Version Control**: ❌ Git ignored

Can contain:
- Personal permissions
- Additional hooks for testing
- Local-only automation

---

## Troubleshooting

### Hook Not Running
```bash
# Check if hooks are enabled in settings
cat .claude/settings.json | grep -A 5 "hooks"

# Verify hook scripts are executable
ls -la .claude/hooks/

# Make scripts executable
chmod +x .claude/hooks/*.sh
```

### Python Hook Fails
```bash
# Ensure Python 3 is available
python3 --version

# Check if Python has required modules
python3 -c "import json, sys, re; from datetime import datetime"
```

### Security Tools Missing
```bash
# Hooks gracefully skip if tools not installed
# Output will show which tools ran:
# "if command -v semgrep >/dev/null 2>&1; then ..."
# No error if tool missing, just skips that check
```

### Format/Lint Failures
```bash
# Run manually to see full output
bash .claude/hooks/format.sh
bash .claude/hooks/lint.sh

# Common issues:
# - Node modules not installed: bun install
# - Packages not built: bun run build:packages
# - Python deps missing: pip install -r apps/api/requirements.txt
```

---

## Best Practices

### For Developers

1. **Let Hooks Work** 🤖
   - Don't manually format/lint - hooks handle it
   - Focus on writing code, hooks ensure quality

2. **Review Hook Output** 👀
   - Hooks show warnings and suggestions
   - Pay attention to security warnings
   - Address Next.js best practice suggestions

3. **Install Optional Tools** 🔧
   - semgrep, bandit, gitleaks provide extra security
   - Not required but highly recommended

4. **Don't Fight Hooks** 🥊
   - If Next.js enforcer blocks, fix the issue
   - Don't try to bypass hooks
   - They catch real problems early

### For Team Leads

1. **Keep .claude/settings.json Updated** 📝
   - This is the source of truth for team hooks
   - Test changes before committing
   - Document any custom hooks added

2. **Monitor Hook Performance** ⚡
   - Hooks should be fast (<5 seconds)
   - If slow, optimize or make optional
   - Balance security vs speed

3. **Review Security Warnings** 🚨
   - Act on security hook warnings immediately
   - Don't ignore hardcoded secrets
   - Update vulnerable dependencies promptly

---

## Hook Comparison: aitmpl.com vs Custom

### What We Kept from aitmpl.com ✅
1. **Security Scanner** - Critical security checks
2. **Dependency Checker** - Vulnerability detection
3. **Next.js Enforcer** - Best practices validation
4. **Update Search Year** - 2025 search results

### What We Replaced with Custom 🔄
1. **Formatting** - Our hook is monorepo-aware (faster)
2. **Linting** - Our hook includes typecheck (comprehensive)

### Why Our Hooks Are Better
- ✅ **Monorepo-aware**: Formats entire workspace, not single files
- ✅ **Faster**: Batch operations vs per-file
- ✅ **TypeScript**: Includes full type checking
- ✅ **Build order**: Ensures packages built before typecheck
- ✅ **Iraqi-specific**: Ruff for Python (used in apps/api)

---

## Related Documentation

- **CI/CD Pipeline**: `docs/CICD_ROADMAP.md`
- **GitHub Workflow**: `docs/GITHUB_WORKFLOW.md`
- **Format Script**: `.claude/hooks/format.sh`
- **Lint Script**: `.claude/hooks/lint.sh`
- **Project Rules**: `CLAUDE.md`

---

## Statistics

**Total Hooks**: 6
**Hook Events**: 2 (PreToolUse, PostToolUse)
**Lines of Hook Code**: ~150 (excluding inline commands)
**Security Checks**: 4 tools
**Format Types**: 5 languages
**Lint Checks**: 3 systems

---

## Changelog

### 2025-01-17 - Initial Setup
- ✅ Merged aitmpl.com hooks with custom hooks
- ✅ Added update-search-year (2025)
- ✅ Added security scanner
- ✅ Added dependency checker
- ✅ Added Next.js code quality enforcer
- ✅ Kept custom format.sh (monorepo-aware)
- ✅ Kept custom lint.sh (includes typecheck)

---

**Last Updated**: 2025-01-17
**Maintained By**: Iraqi AI Development Team
**Status**: ✅ Active and Working
