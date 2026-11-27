// RSS 2.0 без зависимостей: разметка каналa и элементов, экранирование на месте.
import type { Lang } from '../content';

export interface FeedItem {
  title: string;
  description: string;
  link: string;
  pubDate: Date;
  guid: string;
  categories: string[];
}

export interface FeedChannel {
  title: string;
  description: string;
  link: string;
  feedUrl: string;
  lang: Lang;
  items: FeedItem[];
}

const esc = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export const feedXml = (channel: FeedChannel): string => {
  const items = channel.items
    .map((item) => [
      '    <item>',
      `      <title>${esc(item.title)}</title>`,
      `      <link>${esc(item.link)}</link>`,
      `      <guid isPermaLink="true">${esc(item.guid)}</guid>`,
      `      <description>${esc(item.description)}</description>`,
      `      <pubDate>${item.pubDate.toUTCString()}</pubDate>`,
      ...item.categories.map((tag) => `      <category>${esc(tag)}</category>`),
      '    </item>',
    ].join('\n'));

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    `    <title>${esc(channel.title)}</title>`,
    `    <link>${esc(channel.link)}</link>`,
    `    <description>${esc(channel.description)}</description>`,
    `    <language>${channel.lang}</language>`,
    `    <atom:link href="${esc(channel.feedUrl)}" rel="self" type="application/rss+xml" />`,
    `    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    ...items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');
};
