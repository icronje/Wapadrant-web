import { test, expect } from '@playwright/test'

const BASE_URL = 'http://100.119.142.54:3101'

test.describe('Public Pages', () => {
  test('home page loads', async ({ page }) => {
    const res = await page.goto(BASE_URL)
    expect(res?.status()).toBe(200)
    await expect(page.locator('header')).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })

  test('eredienste loads', async ({ page }) => {
    const res = await page.goto(`${BASE_URL}/eredienste`)
    expect(res?.status()).toBe(200)
  })

  test('neem-kennis loads', async ({ page }) => {
    const res = await page.goto(`${BASE_URL}/neem-kennis`)
    expect(res?.status()).toBe(200)
  })

  test('ontdek-jou-plek loads', async ({ page }) => {
    const res = await page.goto(`${BASE_URL}/ontdek-jou-plek`)
    expect(res?.status()).toBe(200)
  })

  test('dien-met-gawes loads', async ({ page }) => {
    const res = await page.goto(`${BASE_URL}/dien-met-gawes`)
    expect(res?.status()).toBe(200)
  })

  test('kontak-ons loads', async ({ page }) => {
    const res = await page.goto(`${BASE_URL}/kontak-ons`)
    expect(res?.status()).toBe(200)
  })

  test('foto-albums loads', async ({ page }) => {
    const res = await page.goto(`${BASE_URL}/foto-albums`)
    expect(res?.status()).toBe(200)
  })

  test('argief loads', async ({ page }) => {
    const res = await page.goto(`${BASE_URL}/argief`)
    expect(res?.status()).toBe(200)
  })

  test('gebeurtenisse loads', async ({ page }) => {
    const res = await page.goto(`${BASE_URL}/gebeurtenisse`)
    expect(res?.status()).toBe(200)
  })

  test('preke loads', async ({ page }) => {
    const res = await page.goto(`${BASE_URL}/preke`)
    expect(res?.status()).toBe(200)
  })

  test('nuusbriewe loads', async ({ page }) => {
    const res = await page.goto(`${BASE_URL}/nuusbriewe`)
    expect(res?.status()).toBe(200)
  })
})