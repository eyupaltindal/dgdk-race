import { test, expect } from '@playwright/test'

test.describe('Layout — Initial State', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dgdk-race/')
    await page.waitForSelector('h1')
  })

  test('shows "Atlar Yarışıyor" as the page heading', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Atlar Yarışıyor' })).toBeVisible()
  })

  test('shows "Hazır" as the initial game status', async ({ page }) => {
    await expect(page.getByText('Hazır')).toBeVisible()
  })

  test('shows horse list empty state', async ({ page }) => {
    await expect(page.getByText('Atlar henüz oluşturulmadı')).toBeVisible()
  })

  test('shows schedule empty state', async ({ page }) => {
    await expect(page.getByText('Program henüz oluşturulmadı')).toBeVisible()
  })

  test('shows race track empty state', async ({ page }) => {
    await expect(page.getByText('Yarış başlatılmadı')).toBeVisible()
  })

  test('"Oluştur" button is visible and enabled', async ({ page }) => {
    const btn = page.getByRole('button', { name: 'Oluştur' })
    await expect(btn).toBeVisible()
    await expect(btn).toBeEnabled()
  })

  test('"Başlat" button is visible but disabled', async ({ page }) => {
    const btn = page.getByRole('button', { name: 'Başlat' })
    await expect(btn).toBeVisible()
    await expect(btn).toBeDisabled()
  })

  test('"Duraklat" button is not visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Duraklat' })).not.toBeVisible()
  })

  test('"İptal Et" button is not visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'İptal Et' })).not.toBeVisible()
  })
})
