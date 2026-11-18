import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './browser',
  use: { baseURL: 'http://127.0.0.1:4173', viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1 },
  webServer: { command: 'npm run build && npm run serve', url: 'http://127.0.0.1:4173', timeout: 30_000 },
  workers: 2,
  reporter: 'list',
});
