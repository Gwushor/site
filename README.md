# site — личный публичный сайт

Витрина: кто я, что делаю, проекты, резюме. Публичный, статический, без бэкенда.

- стек: TypeScript + Astro (статика), сборка в `dist/`;
- оформление: PLAYERPRINT, рисограф-зин — токены и вёрстка в `src/styles/riso.css`;
- страницы: `/` (витрина), `/projects/alpha`, `/projects/hq`, `/blog` (посты и RSS), `/cv` (резюме с печатью в A4), `/about`;
- английская версия тех же страниц — на `/en/`, переключатель языка в шапке, `lang` и `hreflang` выставлены;
- тексты — в `src/content/` (`ru.ts` и `en.ts` рядом, форма в `types.ts`), отдельно от вёрстки;
- деплой: GitHub Actions (`.github/workflows/deploy.yml`) → GitHub Pages, проектная страница `/site/`;
- ни одной ссылки на приватные репозитории, ключей и внутренних адресов: всё, что здесь лежит, читает интернет.

## Блог

Посты — markdown в `src/content/blog/`, один файл = один пост (без подкаталогов). Новый пост: положи
`src/content/blog/<slug>.md` с frontmatter `title`, `description`, `date` (YYYY-MM-DD),
`lang` (`ru`|`en`), `tags`, `draft` — и он появится в списке и в RSS. `draft: true` не
попадает ни в сборку, ни в RSS; перевод связывается полем `translationOf: <slug-оригинала>`
и даёт паре взаимные `hreflang`.

Raw HTML в постах не поддерживается и удаляется при сборке; разметка санитайзером
`hast-util-sanitize` (движок `rehype-sanitize`) дополнительно вычищает `script`/`iframe`/`style`,
обработчики событий и ссылки `javascript:`/`data:` — пост с враждебным HTML собирается без
исполняемых тегов, это гоняет CI (`npm run check:post-html`). Ссылки в постах пиши абсолютными
(`https://…`) либо якорями (`#…`): относительные и корневые (`/…`) не переписываются под base `/site/`.

Каналы RSS: `/rss.xml` (русские посты) и `/en/rss.xml` (английские, когда они есть).
Проверка постов перед сборкой — `npm run check:blog`, её же гоняет CI.

## Локально

```bash
npm ci
npm run dev     # http://localhost:4321/site/
npm run build   # статика в dist/
npm run check   # astro check: типы и разметка без ошибок
npm run check:blog # посты блога: поля и переводы без битых ссылок
npm run preview # посмотреть собранное
```

Сайт живёт под подкаталогом (`base: '/site/'` в `astro.config.mjs`), поэтому внутренние ссылки
берутся из `href()` в `src/lib/url.ts`, а не пишутся от корня.
