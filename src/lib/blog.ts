// Посты блога: выборки, слаги, пары переводов. Читают страницы, RSS и layout.
import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import type { Lang } from '../content';

export type Post = CollectionEntry<'blog'>;

/** Все посты без черновиков, новые сверху. */
export const publishedPosts = async (): Promise<Post[]> => {
  const posts = await getCollection('blog', (post) => !post.data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.id.localeCompare(b.id));
};

/** Посты одного языка без черновиков, новые сверху. */
export const postsByLang = async (lang: Lang): Promise<Post[]> =>
  (await publishedPosts()).filter((post) => post.data.lang === lang);

/** Путь поста без base: '/blog/<slug>' или '/en/blog/<slug>'. */
export const postPath = (post: Post): string =>
  post.data.lang === 'en' ? `/en/blog/${post.id}` : `/blog/${post.id}`;

/** Пара перевода: кто-то ссылается translationOf на этот пост или он сам — на пару. */
export const translationOf = (post: Post, all: Post[]): Post | undefined =>
  all.find((p) => p.id !== post.id && (p.data.translationOf === post.id || post.data.translationOf === p.id));

/** Английским постам нужен свой RSS — канал /en/rss.xml собирается только при них. */
export const hasEnglishPosts = async (): Promise<boolean> => (await postsByLang('en')).length > 0;
