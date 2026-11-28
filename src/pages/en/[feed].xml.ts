import type { APIRoute, GetStaticPaths } from 'astro';
import { content } from '../../content';
import { hasEnglishPosts, postsByLang, postPath } from '../../lib/blog';
import { asset, href } from '../../lib/url';
import { feedXml, type FeedItem } from '../../lib/rss';

/** Английский канал /en/rss.xml собирается только при английских постах. */
export const getStaticPaths: GetStaticPaths = async () =>
  (await hasEnglishPosts()) ? [{ params: { feed: 'rss' } }] : [];

export const GET: APIRoute = async ({ site }) => {
  const t = content.en.blog;
  const abs = (path: string): string => new URL(path, site).href;
  const items: FeedItem[] = (await postsByLang('en')).map((post) => ({
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
    link: abs(href('/en/blog')),
    feedUrl: abs(asset('/en/rss.xml')),
    lang: 'en',
    items,
  });

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
};
