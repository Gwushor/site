// @ts-check
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { sanitize, defaultSchema } from 'hast-util-sanitize';

/** Разрешённый инлайновый CSS в постах: только цвета shiki-переменных и auto. */
const CODE_STYLE_RE = /^(?:(?:color|background-color|overflow-x)\s*:\s*(?:var\(--astro-code-[\w-]+\)|auto)\s*;?\s*)+$/;
/** Разрешённые классы вывода shiki. */
const CODE_CLASS_RE = /^(?:astro-code|css-variables|line|language-[\w-]+)(?:\s+(?:astro-code|css-variables|line|language-[\w-]+))*$/;

const baseAttributes = defaultSchema.attributes ?? {};
const baseProtocols = defaultSchema.protocols ?? {};

// Санитайзер markdown: raw HTML из постов не должен исполняться на домене сайта.
// Библиотечный hast-util-sanitize (движок rehype-sanitize) плюс явные запреты
// и точечные послабления под вывод shiki. Решение описано в README («Блог»).
/** @type {import('hast-util-sanitize').Schema} */
const sanitizeSchema = {
  ...defaultSchema,
  // Явный запрет исполняемого и активного: не пускаем, даже если схема по умолчанию поменяется.
  tagNames: (defaultSchema.tagNames ?? []).filter(
    (tag) => !['script', 'style', 'iframe', 'object', 'embed', 'form', 'link', 'meta', 'base'].includes(tag),
  ),
  // Содержимое script/style — код, а не текст поста: удаляем целиком.
  strip: ['script', 'style'],
  attributes: {
    ...baseAttributes,
    // shiki: <pre class="astro-code css-variables" style="…" tabindex="0" data-language="js">
    // Sätteri отдаёт свойства в сырых именах атрибутов: class, tabindex, …
    pre: [
      ['class', CODE_CLASS_RE],
      'tabindex',
      ['data*', /^[\w-]*$/],
      ['style', CODE_STYLE_RE],
    ],
    span: [['class', CODE_CLASS_RE], ['style', CODE_STYLE_RE]],
    code: [['class', CODE_CLASS_RE]],
  },
  // javascript:, data: и прочие схемы в ссылках запрещены явно; якоря (#…) и
  // относительные пути остаются.
  protocols: {
    ...baseProtocols,
    href: ['http', 'https', 'mailto'],
    src: ['http', 'https'],
  },
  // id не калечим: якоря оглавления ставит плагин заголовков после санитайзера.
  clobber: ['ariaDescribedBy', 'ariaLabelledBy', 'name'],
};

/**
 * Hast-плагин Sätteri: запрет raw HTML + санитайзер всего дерева.
 * Идёт после подсветки (её инлайновые цвета проходят схему) и до расставления
 * id у заголовков (якоря оглавления не задеты).
 * @type {import('satteri').HastPluginDefinition}
 */
const sanitizePlugin = {
  name: 'riso-sanitize',
  /** Raw HTML в markdown не поддерживается: удаляем целиком, чтобы не исполнялся. */
  raw(node, ctx) {
    ctx.removeNode(node);
    ctx.report({ message: 'raw HTML в постах не поддерживается — удалён', node, severity: 'warning' });
  },
  after(root, ctx) {
    const clean = sanitize(structuredClone(root), sanitizeSchema);
    ctx.replaceNode(root, clean);
  },
};

// Проектная страница GitHub Pages: https://gwushor.github.io/site/
export default defineConfig({
  site: 'https://gwushor.github.io',
  base: '/site/',
  trailingSlash: 'always',
  markdown: {
    // Подсветка кода на переменных riso-палитры (src/styles/blog.css), а не на тёмной теме.
    shikiConfig: { theme: 'css-variables' },
    processor: satteri({ hastPlugins: [sanitizePlugin] }),
  },
});
