import { test, expect, type Page } from '@playwright/test'

const BASE_URL = 'http://100.119.142.54:3101'

async function login(page: Page, username = 'admin', password = 'wapadrant2026') {
  await page.goto(`${BASE_URL}/admin/login`)
  await page.fill('input[name="username"]', username)
  await page.fill('input[name="password"]', password)
  await page.click('button[type="submit"]')
  await page.waitForURL(`${BASE_URL}/admin`)
}

// ─── Auth Flow ───

test.describe('Auth Flow', () => {
  test('login page loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`)
    await expect(page).toHaveTitle(/Wapadrant/)
    await expect(page.locator('h1')).toContainText('Wapadrant Admin')
    await expect(page.locator('input[name="username"]')).toBeVisible()
    await expect(page.locator('input[name="password"]')).toBeVisible()
  })

  test('login with valid credentials redirects to /admin', async ({ page }) => {
    await login(page)
    await expect(page).toHaveURL(`${BASE_URL}/admin`)
    await expect(page.locator('h1')).toContainText('Bestuur')
  })

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/login`)
    await page.fill('input[name="username"]', 'wrong')
    await page.fill('input[name="password"]', 'wrong')
    await page.click('button[type="submit"]')
    await expect(page.locator('.bg-red-50')).toBeVisible({ timeout: 5000 })
  })

  test('unauthenticated /admin redirects to login', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`)
    await expect(page).toHaveURL(/\/admin\/login/)
  })

  test('logout clears session', async ({ page }) => {
    await login(page)
    await page.click('button[type="submit"]:has-text("Teken Uit")')
    await expect(page).toHaveURL(/\/admin\/login/)
  })
})

// ─── Admin Routes ───

test.describe('Admin Routes (Authenticated)', () => {
  test.beforeEach(async ({ page }) => {
    await login(page)
  })

  test('admin dashboard loads with stats', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Bestuur')
    await expect(page.locator('.bg-white')).toHaveCount(2)
  })

  test('admin/gebeurtenisse loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/gebeurtenisse`)
    await expect(page).toHaveURL(`${BASE_URL}/admin/gebeurtenisse`)
  })

  test('admin/preke loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/preke`)
    await expect(page).toHaveURL(`${BASE_URL}/admin/preke`)
  })

  test('admin/aankondigings loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/aankondigings`)
    await expect(page).toHaveURL(`${BASE_URL}/admin/aankondigings`)
  })

  test('admin/boodskappe loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/boodskappe`)
    await expect(page).toHaveURL(`${BASE_URL}/admin/boodskappe`)
  })

  test('admin/nuusbriewe loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/nuusbriewe`)
    await expect(page).toHaveURL(`${BASE_URL}/admin/nuusbriewe`)
  })

  test('admin/foto-albums loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/foto-albums`)
    await expect(page).toHaveURL(`${BASE_URL}/admin/foto-albums`)
  })

  test('admin/instellings loads', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin/instellings`)
    await expect(page).toHaveURL(`${BASE_URL}/admin/instellings`)
  })
})

// ─── Edge Middleware ───

test.describe('Edge Middleware Protection', () => {
  test('no 500 errors on admin routes', async ({ page }) => {
    const routes = [
      '/admin', '/admin/gebeurtenisse', '/admin/preke',
      '/admin/aankondigings', '/admin/boodskappe',
      '/admin/nuusbriewe', '/admin/foto-albums', '/admin/instellings',
    ]
    for (const route of routes) {
      const response = await page.goto(`${BASE_URL}${route}`)
      expect(response?.status()).not.toBe(500)
    }
  })

  test('all admin routes redirect when unauthenticated', async ({ page }) => {
    const routes = [
      '/admin/gebeurtenisse', '/admin/preke',
      '/admin/aankondigings', '/admin/boodskappe',
      '/admin/nuusbriewe', '/admin/foto-albums', '/admin/instellings',
    ]
    for (const route of routes) {
      await page.goto(`${BASE_URL}${route}`)
      await expect(page).toHaveURL(/\/admin\/login/)
    }
  })
})