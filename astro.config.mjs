import { defineConfig } from 'astro/config';

// Static site — deploys directly to Cloudflare Pages.
export default defineConfig({
  site: 'https://theee-burger.pages.dev',
  server: { port: 4321 },
});
