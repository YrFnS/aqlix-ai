import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('should navigate between marketing pages and show active states', async ({ page }) => {
    // Start at home
    await page.goto('/')
    await expect(page).toHaveURL('/')

    // Check page title
    await expect(page.locator('h1')).toContainText('Iraqi AI Chat System')

    // Check home link is active (has active class)
    // Skip brand logo, get the actual nav link
    const homeLink = page.locator('nav div a[href="/"]')
    await expect(homeLink).toHaveClass(/text-blue-600/)

    // Navigate to about
    await page.click('a[href="/about"]')
    await expect(page).toHaveURL('/about')

    // Check about link is active
    const aboutLink = page.locator('nav a[href="/about"]')
    await expect(aboutLink).toHaveClass(/text-blue-600/)
    await expect(page.locator('h1')).toContainText('About Us')

    // Navigate to pricing
    await page.click('a[href="/pricing"]')
    await expect(page).toHaveURL('/pricing')
    await expect(page.locator('h1')).toContainText('Pricing')

    // Navigate to contact
    await page.click('a[href="/contact"]')
    await expect(page).toHaveURL('/contact')
    await expect(page.locator('h1')).toContainText('Contact Us')
  })

  test('should handle dynamic routes for docs correctly', async ({ page }) => {
    // Go to docs home
    await page.goto('/docs')
    await expect(page.locator('h1')).toContainText('Documentation')

    // Click on "Getting Started" doc
    await page.click('a[href="/docs/getting-started"]')
    await expect(page).toHaveURL('/docs/getting-started')

    // Check page renders
    await expect(page.locator('h1')).toContainText('Getting Started')

    // Navigate back to docs
    await page.click('a[href="/docs"]')
    await expect(page).toHaveURL('/docs')

    // Click on "API Reference" doc
    await page.click('a[href="/docs/api-reference"]')
    await expect(page).toHaveURL('/docs/api-reference')
    await expect(page.locator('h1')).toContainText('API Reference')
  })

  test('should show 404 for invalid dynamic route', async ({ page }) => {
    await page.goto('/docs/invalid-slug-xyz-123')

    // Should show 404 page
    await expect(page.locator('h2')).toContainText('404')
  })

  test('should handle dynamic routes for blog correctly', async ({ page }) => {
    // Go to blog home
    await page.goto('/blog')
    await expect(page.locator('h1')).toContainText('Blog')

    // Click on first blog post
    await page.click('a[href="/blog/introducing-iraqi-ai"]')
    await expect(page).toHaveURL('/blog/introducing-iraqi-ai')

    // Check page renders
    await expect(page.locator('h1')).toContainText('Introducing Iraqi AI Chat System')

    // Navigate back to blog
    await page.click('a[href="/blog"]')
    await expect(page).toHaveURL('/blog')
  })

  test('should navigate between app pages and show active states', async ({ page }) => {
    // Go to dashboard
    await page.goto('/dashboard')
    await expect(page.locator('h1')).toContainText('Dashboard')

    // Check dashboard link is active
    const dashboardLink = page.locator('nav a[href="/dashboard"]')
    await expect(dashboardLink).toHaveClass(/bg-blue-600/)

    // Navigate to settings
    await page.click('a[href="/settings"]')
    await expect(page).toHaveURL('/settings')
    await expect(page.locator('h1')).toContainText('Settings')

    // Check settings link is active
    const settingsLink = page.locator('nav a[href="/settings"]')
    await expect(settingsLink).toHaveClass(/bg-blue-600/)

    // Navigate to profile
    await page.click('a[href="/profile"]')
    await expect(page).toHaveURL('/profile')
    await expect(page.locator('h1')).toContainText('Profile')
  })

  test('should navigate between route groups seamlessly', async ({ page }) => {
    // Marketing page (with MarketingNav)
    await page.goto('/')
    await expect(page.locator('nav')).toBeVisible()

    // App page (with AppNav)
    await page.goto('/dashboard')
    await expect(page.locator('nav')).toBeVisible()

    // Navigate back to marketing
    await page.goto('/')
    await expect(page.locator('nav')).toBeVisible()

    // Should maintain navigation (no full page reload visual glitch)
  })

  test('should have proper metadata for pages', async ({ page }) => {
    // Check home page metadata
    await page.goto('/')
    await expect(page).toHaveTitle(/Iraqi AI Chat System/)

    // Check docs page metadata
    await page.goto('/docs/getting-started')
    await expect(page).toHaveTitle(/Getting Started.*Iraqi AI Docs/)

    // Check blog page metadata
    await page.goto('/blog/introducing-iraqi-ai')
    await expect(page).toHaveTitle(/Introducing Iraqi AI Chat System.*Iraqi AI Blog/)
  })

  test('should handle browser back/forward navigation', async ({ page }) => {
    await page.goto('/')
    await page.click('a[href="/about"]')
    await expect(page).toHaveURL('/about')

    // Go back
    await page.goBack()
    await expect(page).toHaveURL('/')

    // Go forward
    await page.goForward()
    await expect(page).toHaveURL('/about')
  })

  test('should show no console errors during navigation', async ({ page }) => {
    const consoleMessages: string[] = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleMessages.push(msg.text())
      }
    })

    // Navigate through various pages
    await page.goto('/')
    await page.click('a[href="/about"]')
    await page.click('a[href="/pricing"]')
    await page.click('a[href="/contact"]')
    await page.goto('/docs')
    await page.goto('/blog')
    await page.goto('/dashboard')
    await page.goto('/settings')

    // Should have no console errors
    expect(consoleMessages).toHaveLength(0)
  })
})
