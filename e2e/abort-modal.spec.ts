import { test, expect } from '@playwright/test'

test.describe('AbortModal', () => {
  // Helper to reach the abort-available state (countdown or racing)
  async function startAndTriggerAbort(page: import('@playwright/test').Page) {
    await page.goto('/dgdk-race/')
    await page.locator('h1').waitFor()
    await page.getByRole('button', { name: 'Oluştur' }).click()
    await page.getByRole('button', { name: 'Başlat' }).click()
    // "İptal Et" appears as soon as countdown starts
    await page.getByRole('button', { name: 'İptal Et' }).click()
  }

  test('abort modal opens after clicking "İptal Et"', async ({ page }) => {
    await startAndTriggerAbort(page)
    await expect(page.getByRole('heading', { name: 'Yarışı İptal Et' })).toBeVisible()
  })

  test('modal shows confirmation message', async ({ page }) => {
    await startAndTriggerAbort(page)
    await expect(page.getByText('Tüm ilerleme sıfırlanacak. Emin misiniz?')).toBeVisible()
  })

  test('modal shows "Vazgeç" button', async ({ page }) => {
    await startAndTriggerAbort(page)
    await expect(page.getByRole('button', { name: 'Vazgeç' })).toBeVisible()
  })

  test('modal shows "Evet, İptal Et" button', async ({ page }) => {
    await startAndTriggerAbort(page)
    await expect(page.getByRole('button', { name: 'Evet, İptal Et' })).toBeVisible()
  })

  test('"Vazgeç" dismisses the modal', async ({ page }) => {
    await startAndTriggerAbort(page)
    await page.getByRole('button', { name: 'Vazgeç' }).click()
    await expect(page.getByRole('heading', { name: 'Yarışı İptal Et' })).toBeHidden()
  })

  test('clicking backdrop dismisses the modal', async ({ page }) => {
    await startAndTriggerAbort(page)
    // Click on the semi-transparent backdrop (outside the modal card)
    await page.locator('.fixed.inset-0').click({ position: { x: 10, y: 10 } })
    await expect(page.getByRole('heading', { name: 'Yarışı İptal Et' })).toBeHidden()
  })

  test('"Evet, İptal Et" resets game to idle', async ({ page }) => {
    await startAndTriggerAbort(page)
    await page.getByRole('button', { name: 'Evet, İptal Et' }).click()
    await expect(page.getByText('Hazır')).toBeVisible()
  })

  test('"Evet, İptal Et" clears horse list', async ({ page }) => {
    await startAndTriggerAbort(page)
    await page.getByRole('button', { name: 'Evet, İptal Et' }).click()
    await expect(page.getByText('Atlar henüz oluşturulmadı')).toBeVisible()
  })

  test('"Evet, İptal Et" clears schedule', async ({ page }) => {
    await startAndTriggerAbort(page)
    await page.getByRole('button', { name: 'Evet, İptal Et' }).click()
    await expect(page.getByText('Program henüz oluşturulmadı')).toBeVisible()
  })

  test('"Evet, İptal Et" closes the modal', async ({ page }) => {
    await startAndTriggerAbort(page)
    await page.getByRole('button', { name: 'Evet, İptal Et' }).click()
    await expect(page.getByRole('heading', { name: 'Yarışı İptal Et' })).toBeHidden()
  })
})
