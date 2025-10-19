# E2E Test Suite

Comprehensive end-to-end test suite for the Iraqi AI Chat System web application using Playwright.

## Directory Structure

```
tests/e2e/
├── user-journeys/          # Complete user flow tests
│   ├── chat-flow.spec.ts   # Chat conversation flows
│   └── auth-flow.spec.ts   # Authentication flows
├── accessibility/          # WCAG 2.1 AA compliance tests
│   ├── wcag-compliance.spec.ts     # Automated accessibility checks
│   └── keyboard-navigation.spec.ts # Keyboard-only navigation
├── visual-regression/      # Visual regression tests
│   └── screenshot-comparison.spec.ts # Screenshot comparisons
├── performance/            # Performance and Core Web Vitals
│   └── page-performance.spec.ts    # Load time, metrics
├── arabic-rtl.spec.ts      # Arabic RTL layout tests
├── bidirectional-ui.spec.ts # Mixed Arabic-English UI tests
├── navigation.spec.ts      # Navigation and routing tests
└── rtl-foundation.spec.ts  # RTL foundation tests
```

## Test Categories

### 1. User Journeys

Complete end-to-end user flows testing real-world scenarios:

- **Chat Flow**: Message sending, Arabic conversations, multi-turn dialogs, persistence
- **Auth Flow**: Sign-up, sign-in, password reset, OAuth, session management

### 2. Accessibility Tests

WCAG 2.1 AA compliance and inclusive design:

- **WCAG Compliance**: Automated accessibility checks using axe-core
- **Keyboard Navigation**: Tab order, focus management, shortcuts, RTL support
- **Screen Reader**: ARIA labels, landmarks, semantic HTML
- **Focus Indicators**: Visible focus states for all interactive elements

### 3. Visual Regression Tests

Screenshot-based visual consistency checks:

- **Component States**: Default, hover, focus, disabled, loading, error
- **Layout Variations**: Desktop, tablet, mobile, RTL, dark mode
- **Text Rendering**: Arabic fonts, bidirectional text, mixed content
- **UI Consistency**: Navigation, forms, modals, buttons

### 4. Performance Tests

Core Web Vitals and performance metrics:

- **FCP**: First Contentful Paint < 1.8s
- **LCP**: Largest Contentful Paint < 2.5s
- **FID**: First Input Delay < 100ms
- **CLS**: Cumulative Layout Shift < 0.1
- **TTI**: Time to Interactive < 3.8s
- **Bundle Size**: JavaScript < 500KB, Fonts < 200KB

## Running Tests

### Run All E2E Tests

```bash
bun run test:e2e
```

### Run Specific Test Suites

```bash
# User journeys only
bun test tests/e2e/user-journeys/

# Accessibility only
bun test tests/e2e/accessibility/

# Visual regression only
bun test tests/e2e/visual-regression/

# Performance only
bun test tests/e2e/performance/

# Arabic RTL tests only
bun run test:arabic
```

### Run with UI Mode (Interactive)

```bash
bun run test:e2e:ui
```

### Run on Specific Browsers

```bash
# Chromium only
bun test --project=chromium

# Firefox only
bun test --project=firefox

# WebKit (Safari) only
bun test --project=webkit

# Mobile devices
bun test --project="Mobile Chrome"
bun test --project="Mobile Safari"
```

### Debug Mode

```bash
# Run with headed browser
bun test --headed

# Run in debug mode with Playwright Inspector
bun test --debug
```

## Visual Regression Testing

### Update Baseline Screenshots

```bash
# Update all baselines
bun test tests/e2e/visual-regression/ --update-snapshots

# Update specific test baselines
bun test tests/e2e/visual-regression/screenshot-comparison.spec.ts --update-snapshots
```

### Screenshot Locations

Baseline screenshots are stored in:

```
tests/e2e/visual-regression/__screenshots__/
```

## Accessibility Testing

### Prerequisites

The accessibility tests use axe-core which is injected at runtime. No additional installation needed.

### WCAG Compliance Levels

Tests cover:

- **Level A**: Basic accessibility (all pass)
- **Level AA**: Enhanced accessibility (required for Iraqi AI)
- **Level AAA**: Advanced accessibility (aspirational)

### Common Issues Checked

- Heading hierarchy
- Color contrast (4.5:1 for text, 3:1 for large text)
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Form labels
- Alternative text

## Arabic RTL Testing

### RTL-Specific Tests

1. **Text Direction**: `dir="rtl"` applied correctly
2. **Layout Mirroring**: UI elements properly mirrored
3. **Text Alignment**: Right-aligned for Arabic, left for English
4. **Bidirectional Text**: Proper handling of mixed Arabic-English
5. **Keyboard Navigation**: Arrow key behavior in RTL context
6. **Font Rendering**: Arabic fonts load and display correctly

### Iraqi Dialect Support

Tests verify:

- Iraqi Arabic dialect recognition
- Proper handling of Iraqi-specific terms
- Cultural appropriateness validation

## Performance Budgets

### Page Load Budgets

- Homepage: < 3s total load time
- Dashboard: < 3s with chat interface
- Settings: < 2s

### Core Web Vitals Thresholds

| Metric | Good    | Needs Improvement | Poor    |
| ------ | ------- | ----------------- | ------- |
| FCP    | < 1.8s  | 1.8s - 3s         | > 3s    |
| LCP    | < 2.5s  | 2.5s - 4s         | > 4s    |
| FID    | < 100ms | 100ms - 300ms     | > 300ms |
| CLS    | < 0.1   | 0.1 - 0.25        | > 0.25  |

### Bundle Size Budgets

- Initial JavaScript: < 500KB
- Fonts (total): < 200KB
- Images: Use lazy loading

## CI/CD Integration

### GitHub Actions Workflow

E2E tests run automatically on:

- Pull requests to `main` and `develop`
- Push to `main` and `develop`
- Manual workflow dispatch

### Test Reporting

- HTML report: `playwright-report/index.html`
- JUnit XML: `test-results/junit.xml`
- JSON results: `test-results/results.json`

### Parallel Execution

- CI runs tests on 1 worker (sequential for stability)
- Local development: Uses all CPU cores

## Test Data Management

### Test Fixtures

Located in `tests/setup/`:

- `global-setup.ts`: Global test setup
- `fixtures.ts`: Custom Playwright fixtures

### Mock Data

- API mocking using `page.route()`
- localStorage/sessionStorage management
- Cookie-based authentication simulation

## Best Practices

### Writing E2E Tests

1. **Use data-testid attributes**: Stable selectors that don't change with UI updates
2. **Wait for elements**: Use `waitForSelector()`, `waitForLoadState()`
3. **Disable animations**: `animations: 'disabled'` for screenshot tests
4. **Test real user flows**: Write tests that match actual user behavior
5. **Handle async properly**: Always await async operations

### Arabic/RTL Testing

1. **Test bidirectional text**: Mix Arabic and English in same test
2. **Verify text direction**: Check `dir` attribute and CSS `direction`
3. **Test keyboard navigation**: Ensure arrow keys work in RTL
4. **Check font rendering**: Verify Arabic fonts load correctly
5. **Cultural validation**: Ensure Islamic compliance and Iraqi appropriateness

### Accessibility Testing

1. **Test with keyboard only**: Tab through entire interface
2. **Check focus indicators**: Visible on all interactive elements
3. **Verify ARIA**: Proper labels, roles, and states
4. **Test screen reader**: Use aria-live regions for dynamic content
5. **Color contrast**: Automated checks + manual verification

## Troubleshooting

### Common Issues

#### Tests Failing on CI but Passing Locally

- Check browser versions (CI uses latest stable)
- Verify timeouts are sufficient for slower CI environment
- Ensure tests don't depend on local environment

#### Screenshot Differences

- Platform differences (macOS vs Linux vs Windows fonts)
- Use `threshold` option for acceptable differences
- Update baselines when intentional UI changes occur

#### Flaky Tests

- Add proper waits (`waitForLoadState`, `waitForSelector`)
- Disable animations for visual tests
- Use retry mechanism for unstable tests
- Increase timeouts if network-dependent

#### Arabic Text Not Rendering

- Verify Arabic fonts are loaded
- Check `dir="rtl"` is applied
- Ensure UTF-8 encoding
- Verify font-family includes Arabic font

## Contributing

### Adding New Tests

1. Create test file in appropriate directory
2. Follow naming convention: `*.spec.ts`
3. Use descriptive test names
4. Add data-testid to new components
5. Update this README if adding new categories

### Test Review Checklist

- [ ] Tests cover happy path and edge cases
- [ ] Arabic/RTL scenarios included if applicable
- [ ] Accessibility checks included
- [ ] Performance budgets verified
- [ ] Visual regression baselines created
- [ ] Tests pass on all browsers
- [ ] Documentation updated

## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [axe-core Rules](https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Core Web Vitals](https://web.dev/vitals/)
- [RTL Best Practices](https://rtlstyling.com/)

## Support

For questions or issues:

- Check existing test files for examples
- Review Playwright documentation
- Contact: Iraqi AI Development Team
