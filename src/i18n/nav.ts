export type Lang = 'ko' | 'en' | 'ky' | 'ru';

export const LANGS: Lang[] = ['ko', 'en', 'ky', 'ru'];

export const LANG_LABEL: Record<Lang, string> = {
  ko: '한국어',
  en: 'English',
  ky: 'Кыргызча',
  ru: 'Русский',
};

/** 언어별 주소 접두사. 한국어는 원본과 동일하게 접두사 없음 */
export function prefix(lang: Lang) {
  return lang === 'ko' ? '' : `/${lang}`;
}

export interface NavItem {
  label: string;
  /** 언어 접두사가 앞에 붙는다. `abs` 가 true 면 그대로 쓴다. */
  href: string;
  /** 다른 언어판을 가리킬 때 true (예: 한국어 메뉴의 자료실 → 러시아어판) */
  abs?: boolean;
  children?: { label: string; href: string; abs?: boolean }[];
}

/**
 * 원본 사이트의 메뉴를 언어별로 그대로 옮긴 것.
 * 언어마다 항목 수가 다른 곳이 있는데(예: 참여방법은 ko·ru 에만,
 * 아동건강 증진사업은 ko·en 에만) 원본 상태를 유지한다.
 */
export const NAV: Record<Lang, NavItem[]> = {
  ko: [
    {
      label: '브라이트 키르기즈스탄',
      href: '/about',
      children: [
        { label: '소개', href: '/about' },
        { label: '협력기관', href: '/partners' },
        { label: '참여방법', href: '/join' },
      ],
    },
    {
      label: '프로젝트',
      href: '/projects/lupic',
      children: [
        { label: '국제협력선도대학 육성지원사업', href: '/projects/lupic' },
        { label: '간호교육정책 수립사업', href: '/projects/ges' },
        { label: '아동건강 증진사업', href: '/projects/child-health' },
      ],
    },
    {
      label: '소식',
      href: '/news',
      children: [
        { label: '뉴스', href: '/news' },
        { label: '사회적 영향', href: '/social' },
      ],
    },
    // 자료 97건이 전부 러시아어라 자료실은 러시아어판에만 둔다.
    // 원본 한국어 메뉴도 러시아어판 자료실로 연결돼 있었다.
    {
      label: '자료실',
      href: '/ru/library',
      abs: true,
      children: [{ label: '자료실', href: '/ru/library', abs: true }],
    },
  ],

  en: [
    {
      label: 'Bright Kyrgyzstan',
      href: '/about',
      children: [
        { label: 'About us', href: '/about' },
        { label: 'Partners', href: '/partners' },
      ],
    },
    {
      label: 'Projects',
      href: '/projects/lupic',
      children: [
        { label: 'Leading University Project for International Cooperation', href: '/projects/lupic' },
        { label: 'Global Educational Support', href: '/projects/ges' },
        { label: 'Child Health Promotion Project', href: '/projects/child-health' },
      ],
    },
    {
      label: 'Info',
      href: '/news',
      children: [
        { label: 'News', href: '/news' },
        { label: 'Social impact', href: '/social' },
      ],
    },
    // 영어판에는 자료실 메뉴가 없고 네 번째가 참여방법이다 (원본 그대로).
    {
      label: 'Join us',
      href: '/join',
      children: [{ label: 'Join us', href: '/join' }],
    },
  ],

  ky: [
    {
      label: 'Жаркын Кыргызстан',
      href: '/about',
      children: [
        { label: 'Биз жөнүндө', href: '/about' },
        { label: 'Кызматташуу', href: '/partners' },
      ],
    },
    {
      label: 'Долбоорлор',
      href: '/projects/lupic',
      children: [
        { label: 'LUPIC', href: '/projects/lupic' },
        { label: 'GES', href: '/projects/ges' },
        { label: 'Балдардын ден соолугун чыңдоо долбоору', href: '/projects/child-health' },
      ],
    },
    {
      label: 'Маалымат',
      href: '/news',
      children: [
        { label: 'Жаңылыктар', href: '/news' },
        { label: 'Коомдук таасир', href: '/social' },
      ],
    },
    // 키르기즈어판에도 자료실 메뉴가 없고 네 번째가 참여방법이다 (원본 그대로).
    {
      label: 'Бизге кошулуңуздар',
      href: '/join',
      children: [{ label: 'Бизге кошулуңуздар', href: '/join' }],
    },
  ],

  ru: [
    {
      label: 'Жаркын Кыргызстан',
      href: '/about',
      children: [
        { label: 'О нас', href: '/about' },
        { label: 'Сотрудничество', href: '/partners' },
        { label: 'Присоединяйтесь к нам', href: '/join' },
      ],
    },
    {
      label: 'Проекты',
      href: '/projects/lupic',
      children: [
        { label: 'LUPIC', href: '/projects/lupic' },
        { label: 'GES', href: '/projects/ges' },
        { label: 'Проект по Укреплению Здоровья Детей', href: '/projects/child-health' },
      ],
    },
    {
      label: 'Информация',
      href: '/news',
      children: [
        { label: 'Новости', href: '/news' },
        { label: 'Социальное влияние', href: '/social' },
      ],
    },
    {
      label: 'Архив документов',
      href: '/library',
      children: [{ label: 'Архив документов', href: '/library' }],
    },
  ],
};

/** 원본 sub 페이지 파일명 -> 새 주소 */
export const PAGE_MAP: Record<string, string> = {
  sub01_01: '/about',
  sub01_02: '/partners',
  sub01_03: '/join',
  sub02_01: '/projects/child-health',
  sub02_02: '/projects/ges',
  sub02_03: '/projects/lupic',
  sub03_01: '/news',
  sub03_02: '/social',
  sub04_01: '/library',
};

/** 게시판 제목 (목록 페이지 상단) */
export const BOARD_TITLE: Record<Lang, { news: string; social: string }> = {
  ko: { news: '뉴스', social: '사회적 영향' },
  en: { news: 'News', social: 'Social impact' },
  ky: { news: 'Жаңылыктар', social: 'Коомдук таасир' },
  ru: { news: 'Новости', social: 'Социальное влияние' },
};

/** 목록 표 머리글 — 원본 표기 그대로 */
export const TABLE_HEAD: Record<Lang, string[]> = {
  ko: ['번호', '카테고리', '제목', '작성자', '등록일', '조회'],
  en: ['No', 'Category', 'Title', 'Name', 'Registration Date', 'Hit'],
  ky: ['№', 'Категория', 'Аталышы', 'Администратор', 'Дата', 'Көрүүлөр'],
  ru: ['№', 'Категория', 'Заголовок', 'Автор', 'Дата', 'Просмотры'],
};

export const UI: Record<Lang, { list: string; prev: string; next: string; noPrev: string; noNext: string; attach: string; notice: string }> = {
  ko: { list: '목록', prev: '이전글', next: '다음글', noPrev: '이전글이 없습니다.', noNext: '다음글이 없습니다.', attach: '첨부파일', notice: '공지' },
  en: { list: 'List', prev: 'Previous', next: 'Next', noPrev: 'No previous post.', noNext: 'No next post.', attach: 'Attachment', notice: 'Notice' },
  // 원본은 키르기즈어·러시아어 목록에서도 공지 딱지를 한국어 '공지' 로 그대로 둔다.
  ky: { list: 'Тизме', prev: 'Мурунку', next: 'Кийинки', noPrev: 'Мурунку жазуу жок.', noNext: 'Кийинки жазуу жок.', attach: 'Тиркеме', notice: '공지' },
  ru: { list: 'Список', prev: 'Предыдущая', next: 'Следующая', noPrev: 'Нет предыдущей записи.', noNext: 'Нет следующей записи.', attach: 'Вложение', notice: '공지' },
};

/**
 * 게시판 검색·페이지 이동 문구. 원본 각 언어 목록 페이지에서 그대로 옮겼다.
 * `all` 은 '전체 : 55' 처럼 건수 앞에 붙는 말이자 분류 선택의 첫 항목이다.
 * 페이지 이동 버튼 문구(first/last)는 원본이 모든 언어에서 한국어로 남아 있다.
 */
export const BOARD_UI: Record<
  Lang,
  { all: string; placeholder: string; search: string; first: string; last: string; captionSuffix: string; langLabel: string; empty: string }
> = {
  ko: { all: '전체', placeholder: '검색어', search: '검색하기', first: '처음페이지', last: '마지막페이지', captionSuffix: '목록', langLabel: '한국어', empty: '등록된 게시물이 없습니다.' },
  en: { all: 'ALL', placeholder: 'Keyword', search: 'Search', first: '처음페이지', last: '마지막페이지', captionSuffix: 'List', langLabel: '영문', empty: 'No posts found.' },
  ky: { all: 'бүтүндөй', placeholder: 'издөө сөзү', search: 'Издөө', first: '처음페이지', last: '마지막페이지', captionSuffix: '목록', langLabel: '키르기스어', empty: 'Жазуу табылган жок.' },
  ru: { all: 'Все', placeholder: 'Поиск по сайту', search: 'Поиск', first: '처음페이지', last: '마지막페이지', captionSuffix: '목록', langLabel: '러시아어', empty: 'Записи не найдены.' },
};

/**
 * 분류 선택 목록. 데이터에서 뽑으면 순서가 흔들리므로 원본 순서를 그대로 적어 둔다.
 * 여기에 없는 분류가 글에 들어 있으면 BoardList 가 뒤에 덧붙인다.
 */
/**
 * 글 보기 화면 문구. 원본 각 언어 상세 페이지에서 그대로 옮겼다.
 * 원본은 앞쪽 dl 에 '다음글'(최신 글), 뒤쪽 dl 에 '이전글'(예전 글)을 넣는다.
 */
export const VIEW_UI: Record<Lang, { hit: string; list: string; newer: string; older: string; attach: string; closeLayer: string }> = {
  ko: { hit: '조회수', list: '목록', newer: '다음글', older: '이전글', attach: '첨부파일', closeLayer: '첨부파일 레이어 닫기' },
  en: { hit: 'Number of views', list: 'List', newer: 'New post', older: 'Old post', attach: '첨부파일', closeLayer: '첨부파일 레이어 닫기' },
  ky: { hit: 'көрүүлөр', list: 'Тизме', newer: 'Кийинки макала', older: 'Мурунку макала', attach: '첨부파일', closeLayer: '첨부파일 레이어 닫기' },
  ru: { hit: 'Просмотры', list: 'Список', newer: 'следующий', older: 'предыдущий', attach: '첨부파일', closeLayer: '첨부파일 레이어 닫기' },
};

export const BOARD_CATS: Record<Lang, { news: string[]; social: string[] }> = {
  ko: { news: ['공지사항', '해외언론', '국내언론'], social: ['LUPIC', 'GES', 'Child Health'] },
  en: { news: ['Notice', 'International', 'Korean'], social: ['LUPIC', 'GES', 'Child Health'] },
  ky: { news: ['Кулактандыруу', 'Чет элдик басмалар', 'Кореянын басмалары'], social: ['LUPIC', 'GES', 'Коомдук таасир'] },
  ru: { news: ['Доска объявлений', 'Зарубежные издательства', 'Корейские издательства'], social: ['LUPIC', 'GES', 'Child Health'] },
};
