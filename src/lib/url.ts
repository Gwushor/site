// Ссылки внутри сайта: работают и на превью, и под /site/ на GitHub Pages.
const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
const clean = (path: string): string => path.replace(/^\/+/, '').replace(/\/+$/, '');

/** Ссылка на страницу: всегда со слэшем в конце (`/about/`), как отдаёт сборка. */
export const href = (path = ''): string => {
  const p = clean(path);
  return p === '' ? `${base}/` : `${base}/${p}/`;
};

/** Ссылка на файл из public/: без хвостового слэша (`/favicon.svg`). */
export const asset = (path: string): string => `${base}/${clean(path)}`;
