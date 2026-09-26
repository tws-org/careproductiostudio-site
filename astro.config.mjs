// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://carepracticestudio.com',
  output: 'static',
  trailingSlash: 'never',
  build: {
    // Emit help.html (not help/index.html) so Cloudflare Pages serves /help without a trailing-slash redirect.
    format: 'file',
  },
});
