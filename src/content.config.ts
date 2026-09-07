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
  /**
   * YouTube 주소 — 원본 mp4 첨부를 대체한다.
   * 한 글에 영상이 여러 개 붙는 경우가 있어 여러 줄도 받는다.
   * (관리자 화면에서는 항목을 추가하는 목록으로 보인다.)
   */
  youtube: z.union([z.string(), z.array(z.string())]).default(''),
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

/**
 * 자료실(회원 전용). 원본의 러시아어판 `pds_ru` 게시판을 옮긴 것.
 *
 * 글 본문은 여기에 두지만 **Worker 가 /ru/library/* 앞을 지킨다.**
 * 첨부 파일은 저장소에 넣지 않고 R2 에 두며, `key` 로만 가리킨다.
 * (파일을 public/ 에 넣으면 주소만 알면 누구나 받아가 회원제가 무의미해진다.)
 */
const library = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './content/library' }),
  schema: z.object({
    title: z.string().default(''),
    lang: z.enum(['ko', 'en', 'ky', 'ru']),
    idx: z.string(),
    /** 비우면 목록에서 '공지' 로 표시되고 맨 위로 올라간다 */
    no: z.string().default(''),
    category: z.string().default(''),
    author: z.string().default(''),
    date: z.string().default(''),
    hits: z.string().default('0'),
    attachments: z
      .array(
        z.object({
          name: z.string(),
          /** R2 안의 위치. 내려받기는 /ru/library/file/<key> 로 요청한다 */
          key: z.string(),
          size: z.number().default(0),
        })
      )
      .default([]),
  }),
});

export const collections = { news, social, pages, popups, library };
