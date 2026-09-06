import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { LANGS, prefix } from '../i18n/nav';

/**
 * 사이트맵. 같은 내용의 다른 언어판을 hreflang 로 서로 묶어 준다.
 * 자료실은 robots.txt 에서 막았으므로 넣지 않는다.
 */
export const GET: APIRoute = async ({ site }) => {
  const base = site?.toString().replace(/\/$/, '') ?? '';
  const pages = await getCollection('pages');
  const news = await getCollection('news');
  const social = await getCollection('social');

  /** 언어 접두사를 뺀 경로 목록을 만든다 */
  const paths = new Set<string>(['/']);
  for (const pg of pages) paths.add('/' + pg.data.pageKey.replace(/^projects-/, 'projects/'));
  paths.add('/news');
  paths.add('/social');

  const rows: { loc: string; alts: { lang: string; href: string }[] }[] = [];

  // 언어별로 존재하는 것만 넣되, 같은 경로끼리 hreflang 으로 묶는다
  for (const path of paths) {
    const langsHere = LANGS.filter((l) =>
      path === '/' || path === '/news' || path === '/social'
        ? true
        : pages.some(
            (pg) => pg.data.lang === l && '/' + pg.data.pageKey.replace(/^projects-/, 'projects/') === path
          )
    );
    const alts = langsHere.map((l) => ({ lang: l, href: base + prefix(l) + (path === '/' ? '/' : path) }));
    for (const a of alts) rows.push({ loc: a.href, alts });
  }

  // 게시물
  for (const e of [...news, ...social]) {
    const board = e.collection === 'news' ? 'news' : 'social';
    rows.push({ loc: `${base}${prefix(e.data.lang)}/${board}/${e.data.idx}`, alts: [] });
  }

  const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const body =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    rows
      .map(
        (r) =>
          '  <url>\n    <loc>' +
          esc(r.loc) +
          '</loc>\n' +
          r.alts
            .map(
              (a) =>
                `    <xhtml:link rel="alternate" hreflang="${a.lang}" href="${esc(a.href)}" />\n`
            )
            .join('') +
          '  </url>'
      )
      .join('\n') +
    '\n</urlset>\n';

  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
