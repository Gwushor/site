#!/usr/bin/env node
// Проверка собранного HTML постов: ничего исполняемого.
// Собирает временный пост с враждебным HTML и требует, чтобы страница поста вышла
// без <script>/<iframe>/<style>, обработчиков событий и javascript:/data:-ссылок.
// Заодно проверяет, что гейт (check-blog.mjs) ясно валит пост в подкаталоге.
import { spawnSync } from 'node:child_process';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const blogDir = join(root, 'src', 'content', 'blog');
const fixture = join(blogDir, 'zz-xss-fixture.md');
const nestedDir = join(blogDir, 'zz-nested');
const errors = [];

// Враждебное тело поста — ровно то, чем бил ревьюер, плюс markdown-ссылка.
const fixtureBody = `---
title: XSS fixture
description: Временная фикстура для проверки XSS
date: 2026-11-22
lang: ru
tags: []
draft: false
---

Обычный текст.

<script>window.__pwned = 1</script>

<img src="x" onerror="window.__pwned = 2">

<a href="javascript:alert(1)">живая ссылка</a>

[markdown-ссылка](javascript:alert(2))

<iframe src="https://example.com"></iframe>

<style>body { display: none }</style>

<a href="data:text/html,boom">data-ссылка</a>

\`\`\`js
const ok = true;
\`\`\`
`;

/** Запреты внутри настоящих тегов (текст в HTML экранирован и не опасен). */
const FORBIDDEN_IN_TAG = [
  [/^\s*<(?:script|iframe|style|object|embed|form|link|meta|base)\b/i, 'запрещённый тег'],
  [/\son[a-z]+\s*=/i, 'обработчик события (on*=)'],
  [/href\s*=\s*["']?\s*(?:javascript|data):/i, 'javascript:/data:-ссылка'],
];

/** Проверка одной собранной страницы: разбираем только теги тела поста, не текст. */
const scanHtml = async (pagePath) => {
  const html = await readFile(pagePath, 'utf8');
  if (pagePath.endsWith(join('zz-xss-fixture', 'index.html')) && !html.includes('Обычный текст')) {
    errors.push(`${pagePath}: не похоже на собранную страницу фикстуры`);
    return;
  }
  const region = html.match(/<article[\s\S]*?<\/article>/)?.[0];
  if (!region) {
    errors.push(`${pagePath}: не нашли <article> с телом поста`);
    return;
  }
  for (const tag of region.match(/<[^>]+>/g) ?? []) {
    for (const [re, what] of FORBIDDEN_IN_TAG) {
      if (re.test(tag)) {
        errors.push(`${pagePath}: в теге осталось ${what}: ${tag.slice(0, 120)}`);
      }
    }
  }
};

try {
  // 1. Враждебная фикстура собирается.
  await writeFile(fixture, fixtureBody);
  const build = spawnSync('npm', ['run', 'build'], {
    cwd: root,
    env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' },
    encoding: 'utf8',
  });
  if (build.status !== 0) {
    errors.push(`astro build упал на фикстуре:\n${build.stderr?.slice(-800) ?? ''}`);
  } else {
    // 2. Собранная страница поста — без исполняемого.
    const pages = [];
    for (const dir of ['blog', join('en', 'blog')]) {
      const base = join(root, 'dist', dir);
      for (const entry of await readdir(base, { withFileTypes: true }).catch(() => [])) {
        if (entry.isDirectory()) pages.push(join(base, entry.name, 'index.html'));
      }
    }
    if (!pages.some((p) => p.endsWith(join('zz-xss-fixture', 'index.html')))) {
      errors.push('страница фикстуры не собралась: dist/blog/zz-xss-fixture/index.html нет');
    }
    for (const page of pages) await scanHtml(page);
  }

  // 3. Гейт ясно валит пост в подкаталоге — до сборки, а не «Missing parameter: slug».
  await mkdir(nestedDir, { recursive: true });
  await writeFile(
    join(nestedDir, 'nested.md'),
    '---\ntitle: nested\ndescription: nested\ndate: 2026-11-22\nlang: ru\n---\n\nтекст\n',
  );
  const gate = spawnSync(process.execPath, [join('scripts', 'check-blog.mjs')], {
    cwd: root,
    encoding: 'utf8',
  });
  if (gate.status === 0) {
    errors.push('check:blog пропустил пост в подкаталоге');
  } else if (!/подкаталог/.test(gate.stderr ?? '')) {
    errors.push(`check:blog упал не с тем сообщением: ${(gate.stderr ?? '').trim().slice(0, 300)}`);
  }
} finally {
  await rm(fixture, { force: true });
  await rm(nestedDir, { recursive: true, force: true });
  await rm(join(root, 'dist', 'blog', 'zz-xss-fixture'), { recursive: true, force: true });
}

if (errors.length > 0) {
  console.error(`check-post-html: ошибок ${errors.length}`);
  for (const error of errors) console.error(`  ${error}`);
  process.exit(1);
}

console.log('check-post-html: собранные страницы постов чистые, гейт подкаталоги ловит');
