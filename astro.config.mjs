// @ts-check
import { defineConfig } from 'astro/config';

// Проектная страница GitHub Pages: https://gwushor.github.io/site/
export default defineConfig({
  site: 'https://gwushor.github.io',
  base: '/site/',
  trailingSlash: 'always',
});
