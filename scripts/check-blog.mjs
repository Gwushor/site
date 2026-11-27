#!/usr/bin/env node
// Проверка постов блога перед сборкой: обязательные поля и целые ссылки translationOf.
// Frontmatter парсится тем же yaml-парсером, что и при сборке, чтобы гейт с ней не расходился.
import { readdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const blogDir = join(root, 'src', 'content', 'blog');
const LANGS = new Set(['ru', 'en']);

/** Разбор frontmatter между --- ... ---; возвращает { data } или { error }. */
const parseFrontmatter = (raw) => {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/);
  if (!m) return { error: 'нет frontmatter (--- ... ---)' };
  try {
    const data = parse(m[1]);
    if (data === null || typeof data !== 'object' || Array.isArray(data)) {
      return { error: 'frontmatter — не набор key: value' };
    }
    return { data };
  } catch (e) {
    return { error: `frontmatter не разбирается: ${e.message.split('\n')[0]}` };
  }
};

const errors = [];

/** Все markdown-файлы блога — тот же обход, что и у коллекции (glob '**\/*.{md,mdx}'). */
const walk = async (dir) => {
  const found = [];
  for (const entry of await readdir(dir, { withFileTypes: true }).catch(() => [])) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) found.push(...(await walk(full)));
    else if (/\.(md|mdx)$/.test(entry.name)) found.push(full);
  }
  return found;
};

const files = (await walk(blogDir)).sort();
const posts = [];

for (const full of files) {
  const file = full.slice(blogDir.length + 1);
  if (file.includes('/')) {
    errors.push(`${file}: пост в подкаталоге не поддержан — маршрут blog/[slug] плоский; перенеси файл в src/content/blog/`);
    continue;
  }
  const slug = file.replace(/\.(md|mdx)$/, '');
  const raw = await readFile(full, 'utf8');
  const { data, error } = parseFrontmatter(raw);
  if (error) {
    errors.push(`${file}: ${error}`);
    continue;
  }
  posts.push({ file, slug, data });

  const need = (key, label) => {
    const value = data[key];
    if (typeof value !== 'string' || value.trim() === '') {
      errors.push(`${file}: нет ${label} (${key})`);
      return undefined;
    }
    return value;
  };

  need('title', 'заголовка');
  need('description', 'описания');

  const date = need('date', 'даты');
  if (date !== undefined && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    errors.push(`${file}: date «${date}» не в формате YYYY-MM-DD`);
  } else if (date !== undefined && Number.isNaN(Date.parse(date))) {
    errors.push(`${file}: date «${date}» — не календарная дата`);
  }

  const lang = need('lang', 'языка');
  if (lang !== undefined && !LANGS.has(lang)) {
    errors.push(`${file}: lang «${lang}» — ждём ru или en`);
  }

  if (data.tags !== undefined && !Array.isArray(data.tags)) {
    errors.push(`${file}: tags должен быть списком`);
  }
  if (data.draft !== undefined && typeof data.draft !== 'boolean') {
    errors.push(`${file}: draft должен быть true или false`);
  }
  if (data.translationOf !== undefined && data.translationOf === slug) {
    errors.push(`${file}: translationOf ссылается на сам пост`);
  }
}

// Второй проход: переводы ссылаются на существующие посты другого языка.
for (const post of posts) {
  const target = post.data.translationOf;
  if (target === undefined) continue;
  const found = posts.find((p) => p.slug === target);
  if (!found) {
    errors.push(`${post.file}: translationOf «${target}» — нет поста с таким слагом`);
  } else if (found.data.lang !== undefined && post.data.lang !== undefined && found.data.lang === post.data.lang) {
    errors.push(`${post.file}: translationOf «${target}» — перевод на тот же язык (${post.data.lang})`);
  }
}

if (errors.length > 0) {
  console.error(`check-blog: ошибок ${errors.length}`);
  for (const error of errors) console.error(`  ${error}`);
  process.exit(1);
}

console.log(`check-blog: постов ${posts.length}, ошибок нет`);
