// Тексты сайта: русские и английские рядом, вёрстка их только читает.
import { en } from './en';
import { ru } from './ru';
import type { Lang, SiteContent } from './types';

export const content: Record<Lang, SiteContent> = { ru, en };

/** Путь страницы с учётом языка: '/about' → '/en/about'. */
export const localPath = (path: string, lang: Lang): string =>
  lang === 'en' ? (path === '/' ? '/en' : `/en${path}`) : path;

export type { Lang, SiteContent } from './types';
