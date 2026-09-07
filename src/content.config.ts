import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const postSchema = z.object({
  title: z.string().default(''),
  lang: z.enum(['ko', 'en', 'ky', 'ru']),
  kind: z.enum(['news', 'social']),
  board: z.string(),
  idx: z.string(),
  no: z.string().default(''),
  category: z.string().default(''),
  author: z.string().default(''),
  date: z.string().default(''),
  hits: z.string().default('0'),
  attachments: z
    .array(z.object({ name: z.string(), file: z.string() }))
    .default([]),
  /** YouTube 주소 — 원본 mp4 첨부를 대체 (보류작업.md 참고) */
  youtube: z.string().default(''),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/news' }),
  schema: postSchema,
});

const social = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/social' }),
  schema: postSchema,
});

/**
 * 소개·협력기관·프로젝트 등 고정 페이지.
 * 주의: 프론트매터에 `slug` 를 쓰면 Astro 가 그 값을 항목 ID 로 삼아
 * 언어별 같은 이름 파일이 서로를 덮어쓴다. 그래서 `pageKey` 를 쓴다.
 */
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/pages' }),
  schema: z.object({
    title: z.string().default(''),
    lang: z.enum(['ko', 'en', 'ky', 'ru']),
    pageKey: z.string(),
    visual: z.string().default(''),
  }),
});

/**
 * 메인 화면 팝업. 관리자 화면에서 추가·수정할 수 있도록 콘텐츠로 둔다.
 * 파일 이름이 곧 팝업 구분자이며, 방문자의 '오늘하루 열지 않기' 기억에 쓰인다.
 * 같은 이름을 재사용하면 지난번에 체크한 사람에게는 새 팝업도 안 보인다.
 */
const popups = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/popups' }),
  schema: z.object({
    title: z.string().default(''),
    enabled: z.boolean().default(true),
    image: z.string(),
    /** 이미지를 누르면 갈 곳. 비우면 링크 없음 */
    link: z.string().default(''),
    width: z.number().default(520),
    height: z.number().default(570),
    left: z.number().default(100),
    top: z.number().default(100),
    /** 표시할 언어. 비우면 4개 언어 전부 */
    langs: z.array(z.enum(['ko', 'en', 'ky', 'ru'])).default([]),
    /** YYYY-MM-DD. 비우면 제한 없음 */
    from: z.string().default(''),
    until: z.string().default(''),
  }),
});

export const collections = { news, social, pages, popups };
