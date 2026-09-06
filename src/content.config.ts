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

export const collections = { news, social, pages };
