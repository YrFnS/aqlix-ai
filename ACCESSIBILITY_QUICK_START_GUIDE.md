# Authentication Accessibility - Quick Start Guide

**Date**: 2025-10-23
**Purpose**: Quick reference for running accessibility tests and fixing critical issues
**Audience**: Developers implementing WCAG 2.1 AA compliance

---

## STEP 1: RUN AUTOMATED TESTS (10 minutes)

### Unit Tests

```bash
# Navigate to project root
cd C:\Users\Itokoro\Documents\projects\aqlix-ai

# Run accessibility unit tests
bun test apps/web/tests/accessibility/auth-accessibility.test.tsx

# Expected: ~15 tests, should identify critical gaps
```

### E2E Tests with Playwright

```bash
# Install Playwright browsers (first time only)
bunx playwright install

# Run E2E accessibility tests
bunx playwright test apps/web/tests/e2e/accessibility/auth-wcag-compliance.spec.ts

# Run with UI for debugging
bunx playwright test apps/web/tests/e2e/accessibility/auth-wcag-compliance.spec.ts --ui

# Run specific test
bunx playwright test -g "Login page - should have NO accessibility violations"
```

**Expected Results**:

- Axe-core violations report
- Color contrast verification results
- Keyboard navigation validation
- Focus indicator screenshots

---

## STEP 2: FIX CRITICAL ISSUES (4 hours)

### Fix #1: Add `lang` Attributes (1 hour)

**File**: `apps/web/src/components/auth/login-form.tsx`

```typescript
// BEFORE:
<div
  className="w-full max-w-md space-y-6"
  dir={culturalMode === "ar-IQ" ? "rtl" : "ltr"}
>

// AFTER:
<div
  className="w-full max-w-md space-y-6"
  dir={culturalMode === "ar-IQ" ? "rtl" : "ltr"}
  lang={culturalMode === "ar-IQ" ? "ar-IQ" : culturalMode === "en-US" ? "en-US" : "ar-IQ"}
>
```

**File**: `apps/web/src/components/auth/login-form.tsx` (Lines 132-136)

```typescript
// BEFORE:
<>
  <span className="block">السلام عليكم</span>
  <span className="text-muted-foreground block text-base">Welcome Back</span>
</>

// AFTER:
<>
  <span className="block" lang="ar-IQ">السلام عليكم</span>
  <span className="text-muted-foreground block text-base" lang="en-US">
    Welcome Back
  </span>
</>
```

**Apply to**:

- `login-form.tsx` (4 locations)
- `register-form.tsx` (15+ locations)
- All bilingual text content

**WCAG Criteria**: 3.1.1 (Level A), 3.1.2 (Level AA)

---

### Fix #2: Add Live Region Announcements (1 hour)

**File**: `apps/web/src/components/auth/login-form.tsx` (Line 212)

```typescript
// BEFORE:
{formError && <FormError message={formError} />}

// AFTER:
{formError && (
  <>
    <FormError message={formError} />
    <div
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className="sr-only"
    >
      {formError}
    </div>
  </>
)}
```

**File**: `apps/web/src/components/auth/register-form.tsx` (Line 677)

Apply same pattern.

**WCAG Criteria**: 4.1.3 (Level AA)

---

### Fix #3: Increase Input Height (30 minutes)

**File**: `apps/web/src/components/ui/input.tsx` (Line 10)

```typescript
// BEFORE:
className={cn(
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  className,
)}

// AFTER:
className={cn(
  "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex min-h-[44px] w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
  "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  className,
)}
```

**Change**: `h-9` → `min-h-[44px]`

**WCAG Criteria**: Mobile Touch Target Size (44x44px minimum)

---

### Fix #4: Add Success Message Announcements (30 minutes)

**File**: `apps/web/src/components/auth/login-form.tsx`

```typescript
// Add state for success message
const [successMessage, setSuccessMessage] = useState<string | undefined>();

// Update onSubmit handler (Line 88-103)
if (result.success) {
  setSuccessMessage(
    culturalMode === "ar-IQ"
      ? "تم تسجيل الدخول بنجاح"
      : "Successfully signed in"
  );

  if (result.data?.requiresMfa) {
    setRequiresMfa(true);
    setMfaSetupId(result.data.mfaSetupId);
    router.push(`/auth/mfa-verify?setupId=${result.data.mfaSetupId}`);
  } else {
    if (onSuccess && result.data?.userId) {
      onSuccess(result.data.userId);
    }
    router.push(redirectTo);
  }
}

// Add success announcement component
{successMessage && (
  <div
    role="status"
    aria-live="polite"
    aria-atomic="true"
    className="sr-only"
  >
    {successMessage}
  </div>
)}
```

**WCAG Criteria**: 4.1.3 (Level AA)

---

## STEP 3: MANUAL TESTING (6 hours)

### Color Contrast Testing (2 hours)

**Tool**: WebAIM Contrast Checker (https://webaim.org/resources/contrastchecker/)

**Elements to Test**:

1. **Form Labels**
   - Open `/auth/login` in browser
   - Right-click label → Inspect
   - Copy computed color values
   - Test in WebAIM tool
   - Target: 4.5:1 minimum

2. **Error Messages**
   - Trigger validation error (submit empty form)
   - Inspect error message color
   - Test contrast ratio
   - Target: 4.5:1 minimum

3. **Focus Indicators**
   - Tab to input field
   - Inspect focus ring color
   - Test contrast ratio
   - Target: 3:1 minimum

**Spreadsheet Template**:

| Element       | Foreground | Background | Ratio | Pass/Fail | Notes |
| ------------- | ---------- | ---------- | ----- | --------- | ----- |
| Form Label    | #...       | #...       | X.X:1 | ✅/❌     |       |
| Error Message | #...       | #...       | X.X:1 | ✅/❌     |       |
| Focus Ring    | #...       | #...       | X.X:1 | ✅/❌     |       |

---

### Screen Reader Testing (3 hours)

**Tool**: NVDA (Windows) with Arabic voice pack

#### Setup (30 minutes)

1. Download NVDA: https://www.nvaccess.org/
2. Install NVDA
3. Download eSpeak Arabic voice pack
4. Configure NVDA for Arabic

#### Test Checklist (2.5 hours)

**Login Form Test**:

- [ ] Navigate to `/auth/login`
- [ ] Press `H` to jump to heading - Verify "السلام عليكم" announced
- [ ] Press `Tab` - Verify "البريد الإلكتروني Email" announced
- [ ] Type invalid email, press Enter
- [ ] Verify error message announced: "البريد الإلكتروني غير صحيح"
- [ ] Tab to password field - Verify label announced
- [ ] Tab to submit button - Verify "تسجيل الدخول Sign In" announced
- [ ] Press Enter on empty form
- [ ] Verify error announcements in Arabic

**Register Form Test**:

- [ ] Navigate to `/auth/register`
- [ ] Tab through all form fields
- [ ] Verify all labels announced correctly
- [ ] Test checkbox announcements
- [ ] Test dropdown option announcements
- [ ] Trigger validation errors
- [ ] Verify all error messages announced

**Documentation**:

- Record all announcements
- Note any mispronunciations
- Screenshot NVDA speech viewer
- Document issues found

---

### Mobile Touch Target Testing (1 hour)

**Devices**:

- iPhone SE (375px width)
- iPhone 14 (390px width)
- iPad (768px width)
- Android phone

#### Test Process

1. Open `/auth/login` on mobile device
2. Use finger (not stylus) to tap inputs
3. Verify comfortable tapping
4. Measure actual touch targets if possible
5. Test all interactive elements:
   - Email input
   - Password input
   - Submit button
   - Links (forgot password, register)
   - Checkboxes

**Pass Criteria**:

- All targets tappable with finger
- No accidental activations
- Adequate spacing between elements
- Minimum 44x44px effective size

**Documentation**:

- Screenshots of mobile layout
- List any problematic elements
- Note spacing issues

---

## STEP 4: DOCUMENT RESULTS (2 hours)

### Test Results Report

Create: `ACCESSIBILITY_TEST_RESULTS_2025-10-23.md`

```markdown
# Accessibility Test Results - 2025-10-23

## Automated Tests

### Unit Tests

- **Status**: ✅ PASS / ❌ FAIL
- **Tests Run**: X/15
- **Tests Passed**: X/15
- **Failures**: [List failures]

### E2E Tests

- **Status**: ✅ PASS / ❌ FAIL
- **Axe Violations**: X violations found
- **Critical**: X
- **High**: X
- **Medium**: X

## Manual Tests

### Color Contrast

- **Status**: ✅ PASS / ❌ FAIL
- **Elements Tested**: X
- **Elements Passed**: X
- **Failures**: [List failures with ratios]

### Screen Reader (NVDA)

- **Status**: ✅ PASS / ❌ FAIL
- **Issues Found**: X
- **Critical**: [List critical issues]
- **Minor**: [List minor issues]

### Mobile Touch Targets

- **Status**: ✅ PASS / ❌ FAIL
- **Devices Tested**: [List devices]
- **Issues Found**: [List issues]

## Compliance Summary

**WCAG 2.1 Level A**: X/15 criteria met (X%)
**WCAG 2.1 Level AA**: X/24 criteria met (X%)
**Overall Compliance**: X/39 criteria met (X%)

**Grade**: A- / B+ / C+ / etc.

## Next Steps

1. Fix remaining issues
2. Re-test after fixes
3. Update accessibility documentation
```

---

## STEP 5: VERIFY FIXES (1 hour)

### Re-run All Tests

```bash
# Unit tests
bun test apps/web/tests/accessibility/auth-accessibility.test.tsx

# E2E tests
bunx playwright test apps/web/tests/e2e/accessibility/auth-wcag-compliance.spec.ts

# Verify all tests pass
```

### Manual Verification

- [ ] Re-test color contrast (if any changes)
- [ ] Re-test with NVDA (verify lang attributes work)
- [ ] Re-test mobile touch targets (verify input height fix)
- [ ] Re-test live region announcements

---

## SUCCESS CRITERIA

### Required for WCAG 2.1 AA Compliance

- ✅ **0 critical axe violations**
- ✅ **All automated tests pass**
- ✅ **All color contrasts meet 4.5:1 (text) or 3:1 (UI)**
- ✅ **Screen reader announces all content correctly**
- ✅ **All touch targets meet 44x44px minimum**
- ✅ **Keyboard navigation works in RTL**
- ✅ **Focus indicators visible and meet 3:1 contrast**

### Grade Expectations

| Grade | Compliance | Violations               | Status                   |
| ----- | ---------- | ------------------------ | ------------------------ |
| **A** | 95-100%    | 0 critical, 0-2 minor    | Production-ready         |
| **B** | 85-94%     | 0 critical, 3-5 minor    | Good, minor fixes needed |
| **C** | 75-84%     | 1-2 critical, 5-10 minor | Needs work               |
| **D** | 60-74%     | 3+ critical              | Not compliant            |
| **F** | <60%       | Many critical            | Major rework required    |

**Target**: Grade A (95%+ compliance)

---

## TROUBLESHOOTING

### Common Issues

**Issue**: Axe violations for color contrast
**Solution**: Use WebAIM tool to identify exact problematic colors, adjust Tailwind config

**Issue**: NVDA not announcing Arabic correctly
**Solution**: Verify `lang="ar-IQ"` attributes present, check Arabic voice pack installed

**Issue**: Tests failing on mobile viewport
**Solution**: Check Playwright viewport configuration, verify responsive CSS

**Issue**: Focus indicators not visible
**Solution**: Inspect computed styles, verify `focus-visible:ring` classes applied

### Getting Help

- **WCAG Quick Reference**: https://www.w3.org/WAI/WCAG21/quickref/
- **Axe DevTools**: https://www.deque.com/axe/devtools/
- **WebAIM**: https://webaim.org/
- **Iraqi Accessibility Specialist**: Review full audit report

---

## TIMELINE SUMMARY

| Task                          | Duration      | Priority |
| ----------------------------- | ------------- | -------- |
| Run automated tests           | 10 min        | High     |
| Fix critical issues           | 4 hours       | High     |
| Manual color contrast testing | 2 hours       | High     |
| Screen reader testing         | 3 hours       | Medium   |
| Mobile touch target testing   | 1 hour        | Medium   |
| Document results              | 2 hours       | High     |
| Verify fixes                  | 1 hour        | High     |
| **TOTAL**                     | **~13 hours** |          |

**Realistic Timeline**: 2-3 working days

---

## CHECKLIST

### Before Starting

- [ ] Review full audit report (`AUTHENTICATION_ACCESSIBILITY_AUDIT_REPORT.md`)
- [ ] Install required tools (Bun, Playwright, NVDA)
- [ ] Set up testing environment
- [ ] Create testing spreadsheet

### Code Fixes

- [ ] Add `lang` attributes to containers
- [ ] Add `lang` to bilingual text spans
- [ ] Add `aria-live` regions for errors
- [ ] Add `aria-live` regions for success messages
- [ ] Increase input height to 44px minimum
- [ ] Verify changes with automated tests

### Manual Testing

- [ ] Color contrast testing completed
- [ ] NVDA screen reader testing completed
- [ ] Mobile device testing completed
- [ ] Document all results

### Documentation

- [ ] Create test results report
- [ ] Update accessibility documentation
- [ ] Screenshot evidence collected
- [ ] Issues documented with remediation steps

### Verification

- [ ] All automated tests pass
- [ ] Manual tests pass
- [ ] Grade A (95%+) achieved
- [ ] Ready for production

---

**Quick Start**: Run automated tests first, fix critical issues, then do manual testing. Expected total time: 13 hours over 2-3 days.

**End of Quick Start Guide**
