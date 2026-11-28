import type { APIRoute } from 'astro';
import { content } from '../content';
import { postsByLang, postPath } from '../lib/blog';
import { asset, href } from '../lib/url';
import { feedXml, type FeedItem } from '../lib/rss';

/** Русский канал: /rss.xml. Черновики не попадают. */
export const GET: APIRoute = async ({ site }) => {
  const t = content.ru.blog;
  const abs = (path: string): string => new URL(path, site).href;
  const items: FeedItem[] = (await postsByLang('ru')).map((post) => ({
    title: post.data.title,
    description: post.data.description,
    link: abs(href(postPath(post))),
    guid: abs(href(postPath(post))),
    pubDate: post.data.date,
    categories: post.data.tags,
  }));

  const xml = feedXml({
    title: t.feedTitle,
    description: t.feedDescription,
    link: abs(href('/blog')),
    feedUrl: abs(asset('/rss.xml')),
    lang: 'ru',
    items,
  });

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
