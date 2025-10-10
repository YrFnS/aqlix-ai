# GitHub Workflow - Agent-Automated Development

**Philosophy**: In the agents era, GitHub operations are **automated by agents** during PRP execution. Simple two-branch strategy with agent automation.

## 🌳 Two-Branch Strategy

### **Simple and Effective**

```
main (production-ready, stable)
  ↑
  merge when feature complete
  ↑
develop (ongoing PRP work)
  ├── commit: feat(arabic): font system (Initial #11)
  ├── commit: feat(arabic): input system (Initial #12)
  ├── commit: feat(arabic): voice system (Initial #13)
  └── ... (continue with PRPs)
```

**How It Works**:
- **develop**: Where all PRP work happens (agent commits here)
- **main**: Only stable, tested features (merge from develop when ready)

**Benefits**:
- ✅ Simple workflow (just two branches)
- ✅ Main stays stable
- ✅ CI/CD validates develop before merging
- ✅ Easy for agents to automate
- ✅ Industry best practice for solo developers

## 🤖 Agent-Automated Workflow

### **Per PRP Execution**

```bash
# Agent automatically executes:
1. Switch to develop: git checkout develop
2. Generate/read PRP (you do this)
3. Execute PRP implementation
4. Run tests: bun run test (appropriate tests)
5. Commit to develop:
   git commit -m "feat(arabic): implement font system

   - Add Noto Sans Arabic, Amiri, Cairo fonts
   - Implement font-arabic CSS class
   - Add RTL-aware font fallback system

   Initial #11"

6. Push to develop: git push origin develop
7. CI/CD validates automatically
```

**No manual work required** - agent handles everything!

### **Merging to Main** (After Feature Complete)

```bash
# After completing a logical feature (e.g., Arabic Foundation - PRPs 11-16):

# Agent automatically executes:
1. Switch to main: git checkout main
2. Merge develop: git merge develop --no-ff
3. Tag release: git tag -a v0.2.0-arabic-foundation -m "Arabic Foundation Layer Complete"
4. Push to main: git push origin main --tags
5. Switch back to develop: git checkout develop
6. Continue working on next PRPs
```

**When to Merge to Main**:
- After completing a logical feature layer (e.g., PRPs 11-16, 17-20, 21-28)
- After fixing critical bugs
- Before major milestones (MVP launch, etc.)
- When develop has been thoroughly tested

## 📋 GitHub Issue Tracking

### **Agent Creates Issues Automatically**

```bash
# When starting a PRP, agent creates tracking issue:
gh issue create \
  --title "Initial #11: Arabic Font System" \
  --body "Implementing Noto Sans Arabic, Amiri, and Cairo fonts with RTL optimization.

**Scope**:
- Font integration and loading optimization
- RTL-aware font fallback system
- Cultural font preferences

**Testing**:
- Font rendering tests
- RTL layout validation
- Performance benchmarks

See: PRPs/arabic-font-system.md" \
  --label "enhancement,arabic,initial-11"

# When PRP complete, agent closes issue:
git commit -m "feat(arabic): implement font system

Closes #11"
```

**Benefits**:
- ✅ Track what's done/pending
- ✅ Link commits to issues
- ✅ Searchable history
- ✅ Fully automated by agents

## 🏷️ Tagging Strategy

### **Semantic Versioning**

```
v0.1.0 - Core Foundation (Initials 1-10) ✅
v0.2.0 - Arabic Foundation (Initials 11-16) 🔄
v0.3.0 - Advanced Arabic (Initials 17-20)
v0.4.0 - Payment Integration (Initials 21-28)
v0.5.0 - Document System (Initials 29-35)
v0.6.0 - Voice System (Initials 36-42)
v0.7.0 - Desktop Integration (Initials 43-47)
v1.0.0 - MVP Launch 🚀
```

**Agent Creates Tags**:
```bash
# After merging feature to main:
git tag -a v0.2.0-arabic-foundation -m "Arabic Foundation Layer Complete

Implemented Initials 11-16:
- Arabic Font System
- Arabic Input System
- Arabic Voice System
- Arabic Text Processing
- Arabic UI Components
- Arabic RTL Layout

All cultural validation tests passing (95%+)
All Arabic tests passing (99%+ RTL accuracy, 85%+ dialect)
WCAG 2.1 AA compliant"

git push origin v0.2.0-arabic-foundation
```

## 🔄 Complete PRP Execution Flow

### **Example: Executing PRP #11 (Arabic Font System)**

```bash
# 1. You generate the PRP (manual)
You: "Generate PRP for Initial #11: Arabic Font System"

# 2. Agent execution begins (automated)
iraqi-prp-execution-orchestrator:
  ├── ✓ Check current branch (ensure on develop)
  ├── ✓ Pull latest: git pull origin develop
  ├── ✓ Create issue: gh issue create "Initial #11: Arabic Font System"
  ├── ✓ Read PRP: PRPs/arabic-font-system.md
  ├── ✓ Execute implementation steps
  │   ├── Install fonts
  │   ├── Create CSS utilities
  │   ├── Add font loading optimization
  │   └── Implement fallback system
  ├── ✓ Run tests: bun run test:arabic
  ├── ✓ Commit: git commit -m "feat(arabic): implement font system"
  ├── ✓ Push: git push origin develop
  ├── ✓ CI/CD validates (automatic)
  └── ✓ Close issue: gh issue comment + close

# 3. Ready for next PRP (automated)
You: "Generate PRP for Initial #12: Arabic Input System"
[Repeat process]
```

## 🚦 CI/CD Integration

### **Automatic Validation**

Your CI/CD workflows (`.github/workflows/ci.yml` and `pr.yml`) automatically run on:

**On Push to Develop**:
```yaml
# .github/workflows/ci.yml triggers
on:
  push:
    branches: [main, develop]  # ✓ Validates every push to develop
```

**Validates**:
- ✅ ESLint (code quality)
- ✅ TypeScript (type checking)
- ✅ Build (compilation)
- ✅ Unit tests
- ✅ Cultural validation (if applicable)
- ✅ Arabic RTL tests (if applicable)

**On PR to Main**:
```yaml
# .github/workflows/pr.yml triggers
on:
  pull_request:
    branches: [main]  # ✓ When merging develop → main
```

**Additional Checks**:
- ✅ PR title format
- ✅ Breaking changes detection
- ✅ Bundle size check
- ✅ Cultural/Arabic file detection

## 📊 Branch Management

### **Current Branches**

```bash
main     - Production-ready code only
develop  - Ongoing PRP work (active development)
```

### **Branch Protection** (Phase 2 - Later)

When you need stricter controls (after Initial #28 - Payment Integration):

```bash
# Protect main branch (agent can execute):
gh api repos/YrFnS/aqlix-ai/branches/main/protection \
  --method PUT \
  --field required_status_checks[strict]=true \
  --field required_status_checks[contexts][]=ci-success \
  --field enforce_admins=false  # You can still push if needed
```

**For Now (Phase 1)**: No branch protection - agent can merge freely.

## 🎯 Workflow Maturity Phases

### **Phase 1: Two-Branch + Automation (NOW)** ✅

**Active**:
- ✅ Two branches: main + develop
- ✅ Agent commits to develop
- ✅ CI/CD validates develop
- ✅ Agent merges to main when ready
- ✅ Issue tracking automated
- ✅ Semantic commit messages

**Ready for**: PRP #11 execution!

### **Phase 2: Enhanced Protection (After Initial #28)**

**Add Later**:
- Branch protection on main
- Require PR reviews (optional)
- Automated deployment previews
- Performance benchmarking

**Trigger**: Payment integration complete (security-critical)

### **Phase 3: Release Automation (Before MVP Launch)**

**Add Before MVP**:
- Automated changelog generation
- Release notes automation
- Deployment to production
- Monitoring and alerts

**Trigger**: Before v1.0.0 MVP launch

## 📝 Agent Configuration

### **GitHub MCP Tools Used**

Agents use these GitHub MCP tools automatically:

```typescript
// iraqi-prp-execution-orchestrator workflow
async function executePRP(prp: PRP) {
  // 1. Ensure on develop branch
  await git.checkout('develop');
  await git.pull('origin', 'develop');

  // 2. Create tracking issue
  const issue = await github.createIssue({
    title: `Initial #${prp.number}: ${prp.name}`,
    body: prp.description,
    labels: ['enhancement', prp.domain, `initial-${prp.number}`]
  });

  // 3. Execute PRP implementation
  await implementPRP(prp);

  // 4. Commit with semantic message
  await git.commit({
    message: `feat(${prp.domain}): ${prp.title}\n\n${prp.summary}\n\nCloses #${issue.number}`
  });

  // 5. Push to develop
  await git.push('origin', 'develop');

  // 6. Wait for CI/CD validation
  await waitForCI();

  // 7. Close issue
  await github.closeIssue(issue.number);
}

// Merge to main after feature complete
async function mergeFeatureToMain(featureName: string, version: string) {
  await git.checkout('main');
  await git.merge('develop', { noFastForward: true });
  await git.tag(version, featureName);
  await git.push('origin', 'main', { tags: true });
  await git.checkout('develop');
}
```

## 🎓 Best Practices from Research

Based on 2025 industry research:

1. **"Even solo developers should use branches"** - Multiple sources confirm this
2. **"GitHub Flow with CI/CD discipline"** - Every change validated before merging
3. **"Main stays production-ready"** - Never break the main branch
4. **"Automated testing on feature branches"** - Catch issues early
5. **"Clear commit history"** - Semantic commits with issue linking

## 🚀 Quick Reference

### **Daily Development**
```bash
# You are always on develop branch (agent manages this)
git status  # Should show: On branch develop

# Agent does:
1. Execute PRP
2. Commit to develop
3. Push to develop
4. CI/CD validates
```

### **Merge to Main** (Periodic)
```bash
# After completing feature layer (e.g., PRPs 11-16):
git checkout main
git merge develop --no-ff -m "feat: Arabic Foundation Layer (Initials 11-16)"
git tag -a v0.2.0-arabic-foundation -m "Arabic Foundation Complete"
git push origin main --tags
git checkout develop
```

### **Check Status**
```bash
# See commit differences
git log main..develop  # What's new in develop

# See branch status
git branch -vv         # Show all branches

# See CI/CD status
gh run list            # Recent workflow runs
```

---

**Ready for Agent-First Development with Simple Two-Branch Strategy!** 🤖✨

**Current Status**: On `develop` branch, ready to execute PRP #11! 🚀
