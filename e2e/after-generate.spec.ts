import { test, expect } from '@playwright/test'

test.describe('After Generate — Horse List & Schedule', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dgdk-race/')
    await page.waitForSelector('h1')
    await page.getByRole('button', { name: 'Oluştur' }).click()
  })

  test('game status changes to "Program Hazır"', async ({ page }) => {
    await expect(page.getByText('Program Hazır')).toBeVisible()
  })

  test('horse list empty state disappears', async ({ page }) => {
    await expect(page.getByText('Atlar henüz oluşturulmadı')).not.toBeVisible()
  })

  test('first horse "Yıldırım" appears in the horse list', async ({ page }) => {
    await expect(page.getByText('Yıldırım').first()).toBeVisible()
  })

  test('second horse "Fırtına" appears in the horse list', async ({ page }) => {
    await expect(page.getByText('Fırtına').first()).toBeVisible()
  })

  test('last horse "Dağlı" appears in the horse list', async ({ page }) => {
    await expect(page.getByText('Dağlı').first()).toBeVisible()
  })

  test('schedule empty state disappears', async ({ page }) => {
    await expect(page.getByText('Program henüz oluşturulmadı')).not.toBeVisible()
  })

  test('schedule shows "Tur 1"', async ({ page }) => {
    await expect(page.getByText('Tur 1').first()).toBeVisible()
  })

  test('schedule shows all 6 rounds', async ({ page }) => {
    for (let i = 1; i <= 6; i++) {
      await expect(page.getByText(`Tur ${i}`).first()).toBeVisible()
    }
  })

  test('"Başlat" button becomes enabled', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Başlat' })).toBeEnabled()
  })

  test('"Oluştur" button remains enabled for re-generation', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Oluştur' })).toBeEnabled()
  })

  test('"İptal Et" button is still not visible', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'İptal Et' })).not.toBeVisible()
  })

  test('race track still shows "Yarış başlatılmadı"', async ({ page }) => {
    await expect(page.getByText('Yarış başlatılmadı')).toBeVisible()
  })

  test('re-clicking "Oluştur" regenerates horses', async ({ page }) => {
    await page.getByRole('button', { name: 'Oluştur' }).click()
    await expect(page.getByText('Program Hazır')).toBeVisible()
    await expect(page.getByText('Yıldırım').first()).toBeVisible()
  })
})
