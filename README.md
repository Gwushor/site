# site — личный публичный сайт

Витрина: кто я, что делаю, проекты, контакты. Публичный, статический, без бэкенда.

- стек: TypeScript + Astro (статика), сборка в `dist/`;
- оформление: PLAYERPRINT, рисограф-зин — токены и вёрстка в `src/styles/riso.css`;
- страницы: `/` и `/about`, тексты — в `src/content/site.ts`;
- деплой: GitHub Actions (`.github/workflows/deploy.yml`) → GitHub Pages, проектная страница `/site/`;
- ни одной ссылки на приватные репозитории, ключей и внутренних адресов: всё, что здесь лежит, читает интернет.

## Локально

```bash
npm ci
npm run dev     # http://localhost:4321/site/
npm run build   # статика в dist/
npm run preview # посмотреть собранное
```

Сайт живёт под подкаталогом (`base: '/site/'` в `astro.config.mjs`), поэтому внутренние ссылки
берутся из `href()` в `src/lib/url.ts`, а не пишутся от корня.
