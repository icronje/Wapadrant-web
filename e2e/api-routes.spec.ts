import { test, expect } from '@playwright/test'

const BASE_URL = 'http://100.119.142.54:3101'

test.describe('API Routes', () => {
  test('GET /api/auth/providers returns credentials', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/auth/providers`)
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.credentials).toBeDefined()
  })

  test('GET /api/auth/csrf returns token', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/auth/csrf`)
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body.csrfToken).toBeTruthy()
  })

  test('GET /api/auth/session returns null when unauthenticated', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/auth/session`)
    expect(res.status()).toBe(200)
    const body = await res.json()
    expect(body).toBeNull()
  })

  test('POST /api/auth/callback/credentials rejects wrong credentials', async ({ request }) => {
    const csrfRes = await request.get(`${BASE_URL}/api/auth/csrf`)
    const { csrfToken } = await csrfRes.json()
    const res = await request.post(`${BASE_URL}/api/auth/callback/credentials`, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: `username=wrong&password=wrong&csrfToken=${csrfToken}&callbackUrl=${BASE_URL}/admin&json=true`,
    })
    expect(res.status()).toBe(302)
    const location = res.headers()['location']
    expect(location).toContain('error')
  })

  test('GET /api/events returns published events', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/events`)
    expect(res.status()).toBe(200)
    const events = await res.json()
    expect(Array.isArray(events)).toBe(true)
  })

  test('GET /api/sermons returns sermons', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/sermons`)
    expect(res.status()).toBe(200)
  })

  test('GET /api/announcements returns announcements', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/announcements`)
    expect(res.status()).toBe(200)
  })

  test('GET /api/newsletters returns newsletters', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/newsletters`)
    expect(res.status()).toBe(200)
  })

  test('GET /api/photo-albums returns albums', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/photo-albums`)
    expect(res.status()).toBe(200)
  })

  test('GET /api/contact accepts POST', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/api/contact`, {
      data: {
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message',
      },
    })
    expect(res.status()).toBe(201)
  })
})