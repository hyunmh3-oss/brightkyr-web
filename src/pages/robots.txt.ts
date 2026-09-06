import type { APIRoute } from 'astro';

/**
 * 공개 페이지는 검색 노출을 허용한다.
 * 자료실(/library)은 회원 전용이 될 자리이므로 미리 막아 둔다.
 */
export const GET: APIRoute = ({ site }) => {
  const base = site?.toString().replace(/\/$/, '') ?? '';
  const body = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /library',
    'Disallow: /en/library',
    'Disallow: /ky/library',
    'Disallow: /ru/library',
    '',
    `Sitemap: ${base}/sitemap.xml`,
    '',
  ].join('\n');

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
