# Claude Code Hooks - Quick Reference

**🎯 Optimal hook configuration for Iraqi AI Chat System**

## What Changed?

We merged the best hooks from aitmpl.com with our custom monorepo-aware hooks.

## Active Hooks

### PreToolUse (Before Actions)
1. **Update Search Year** 📅 - Adds "2025" to web searches

### PostToolUse (After File Edits)
1. **Security Scanner** 🔒 - Detects vulnerabilities and secrets
2. **Dependency Checker** 📦 - Checks for vulnerable dependencies
3. **Next.js Enforcer** ⚛️ - Validates Next.js best practices
4. **Format** 🎨 - Auto-formats entire monorepo
5. **Lint** 🔍 - Lints and typechecks entire monorepo

## Hook Scripts

### format.sh
Auto-formats all code:
- Python: Ruff format (apps/api)
- JavaScript/TypeScript/CSS/JSON: Prettier (all workspaces)
- Markdown: Prettier (docs, READMEs)

### lint.sh
Validates code quality:
- Python: Ruff check (apps/api)
- JavaScript/TypeScript: ESLint (all workspaces)
- TypeScript: Type checking (all workspaces)

## Manual Testing

```bash
# Test format hook
bash .claude/hooks/format.sh

# Test lint hook
bash .claude/hooks/lint.sh

# Validate settings.json
cat ../.claude/settings.json | python3 -m json.tool > /dev/null
```

## Installation

**Required** (core hooks):
```bash
# Already installed in project
bun install
pip install ruff
```

**Optional** (enhanced security):
```bash
pip install semgrep bandit safety
brew install gitleaks  # or download from GitHub
npm install -g npm-check-updates
```

## Performance

- **Format**: ~2-5 seconds (entire monorepo)
- **Lint**: ~5-10 seconds (entire monorepo)
- **Security**: ~1-3 seconds (per file)
- **Next.js**: ~1-2 seconds (per file)
- **Total**: ~10-20 seconds per edit

## Configuration Files

- **Team hooks**: `.claude/settings.json` (committed)
- **Personal hooks**: `.claude/settings.local.json` (gitignored)
- **Scripts**: `.claude/hooks/*.sh`

## Documentation

Full documentation: `docs/HOOKS_SETUP.md`

## Status

✅ Active and working
✅ Tested and validated
✅ Ready for production use
