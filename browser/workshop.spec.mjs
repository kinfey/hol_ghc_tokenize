import { expect, test } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { labs } from '../src/lab.mjs';
import { encode } from 'gpt-tokenizer/encoding/o200k_base';

for (const [i, lab] of labs.entries()) {
  test(`lab ${i + 1} replay, controls, and evidence`, async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`/workbench.html?step=${i + 1}`);
    await expect(page.getByRole('heading', { name: lab.titles[0] })).toBeVisible();
    await page.getByRole('button', { name: 'Run replay' }).click();
    await expect(page.locator('#result').getByRole('table').getByRole('row')).toHaveCount(3);
    await expect(page.getByText('Synthetic token buckets', { exact: false })).toBeVisible();
    if (i === 3) {
      await page.getByLabel('Source risk').selectOption('conflicting');
      await page.getByRole('button', { name: 'Run replay' }).click();
      await expect(page.getByRole('table').getByText('gpt-6.2-sol', { exact: true })).toHaveCount(2);
    }
    if (i === 4) {
      await expect(page.getByText('ALLOW', { exact: true })).toBeVisible();
      await page.getByLabel('Ceiling (USD)').fill('0.0005');
      await page.getByRole('button', { name: 'Run replay' }).click();
      await expect(page.getByText('BLOCK', { exact: true })).toBeVisible();
    }
    if (i === 0) {
      await page.getByText('Make a source packet').click();
      await page.getByLabel('Episode title').fill('Community Garden');
      await page.getByLabel('Source text and excerpts').fill('Rainwater feeds the garden.');
      await page.getByLabel('Reference URLs').fill('https://example.org/garden');
      const receive = page.waitForEvent('download');
      await page.getByRole('button', { name: 'Download episode.json' }).click();
      const download = await receive;
      const packet = JSON.parse(await readFile(await download.path(), 'utf8'));
      expect(packet).toEqual({ title: 'Community Garden', content: 'Rainwater feeds the garden.', links: ['https://example.org/garden'] });
      await page.getByText('Make a source packet').click();
    }
    expect(errors).toEqual([]);
    if (process.env.CAPTURE === '1') await page.screenshot({ path: `${lab.slug}/evidence.png`, animations: 'disabled' });
  });

}

test('browser tokenizer compares arbitrary text against Node counts and shows live evidence', async ({ page }) => {
  await page.goto('/workbench.html?step=2');
  const before = 'Please kindly write a short script about the community garden.';
  const after = 'Write a short script about the community garden.';
  await page.getByLabel('Before', { exact: true }).fill(before);
  await page.getByLabel('After', { exact: true }).fill(after);
  await page.getByRole('button', { name: 'Compare tokens' }).click();
  await expect(page.locator('#comparison')).toContainText(`${encode(before).length} → ${encode(after).length} tokens`);
  const observed = page.locator('#live-comparison');
  await expect(observed.getByText('3,527')).toBeVisible();
  if (process.env.CAPTURE === '1') await observed.screenshot({ path: '02-compress/comparison.png', animations: 'disabled' });
});

for (const [suffix, locale] of [['', 'en'], ['.zh', 'zh-Hans'], ['.hk', 'zh-Hant-HK']]) {
  test(`Pages provides a home and five guides for ${locale}`, async ({ page, request }) => {
    for (const dir of ['', ...labs.map(l => `${l.slug}/`)]) {
      await page.goto(`/${dir}index${suffix}.html`);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('article h1')).toBeVisible();
      await expect(page.getByRole('link', { name: 'Open Workbench' })).toBeVisible();
      if (dir) {
        expect((await request.get(`/${dir}flow.svg`)).ok()).toBe(true);
        if (process.env.CAPTURE !== '1') expect((await request.get(`/${dir}evidence.png`)).ok()).toBe(true);
      }
    }
  });
}

test('HyperFrames sample loads and exposes a seekable video', async ({ page, request }) => {
  const response = await request.get('/media/garden.mp4', { headers: { Range: 'bytes=0-63' } });
  expect(response.status()).toBe(206);
  expect(response.headers()['content-type']).toBe('video/mp4');
  await page.goto('/workbench.html?step=5');
  const video = page.locator('video');
  await expect(video).toBeVisible();
  await expect.poll(() => video.evaluate(v => Number.isFinite(v.duration) ? v.duration : 0)).toBeGreaterThan(5);
  await video.evaluate(v => { v.currentTime = v.duration / 2; });
  await expect.poll(() => video.evaluate(v => !v.seeking && v.currentTime > 2)).toBe(true);
  if (process.env.CAPTURE === '1') await page.locator('#sample').screenshot({ path: '05-budget-release/vlog.png', animations: 'disabled' });
});
