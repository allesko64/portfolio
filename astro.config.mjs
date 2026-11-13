// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://ayush64.me',
  // Pages stay static (prerendered). Only routes that opt out with
  // `export const prerender = false` (the /api/views counter) run on the edge.
  adapter: cloudflare({
    // Images are optimised at build time with sharp; nothing is transformed at runtime.
    imageService: 'compile',
  }),
  markdown: {
    shikiConfig: { theme: 'github-dark-dimmed' },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
