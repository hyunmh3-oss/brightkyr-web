import type { Lang } from './nav';

/**
 * 메인 페이지 고정 문구·링크.
 * 원본(brightkyr.khu.ac.kr) 각 언어 index.php 에서 그대로 옮겼다.
 * 프로젝트 카드 제목은 원본이 <br> 로 줄을 나눠 두었으므로 HTML 그대로 둔다.
 */

export interface HomeProject {
  href: string;
  img: string;
  /** <br> 포함 HTML */
  tit: string;
}

export interface HomeData {
  project: { p: string; h2: string; items: HomeProject[] };
  notice: { p: string; h2: string; h3: [string, string, string] };
  /** 세 번째 칸 — 게시물이 아니라 '참여방법' 안내 카드 */
  apply: { href: string; img: string; cate: string; h4: string; txt: string };
  partner: { p: string; h2: string };
  /** 슬라이더 버튼 — 원본은 모든 언어에서 한국어로 남아 있다 */
  prevBtn: string;
  nextBtn: string;
}

/** 배너는 언어와 무관하게 같은 이미지 2장을 쓴다 */
export const BANNERS = [
  '/images/uploaded/banner/1ce6c7f18a1d3f7d6499c847eaabd2e1.jpg',
  '/images/uploaded/banner/a7b56e04c147b7f2d93f69f4248f05b1.jpg',
];

/** 협력기관 로고 — 원본 순서 그대로. 링크가 없는 곳은 href 를 비운다. */
export const PARTNERS: { href: string; img: string }[] = [
  { href: 'http://khu.ac.kr/', img: '/images/main/partner1.png' },
  { href: 'https://www.kgma.kg/', img: '/images/main/partner2.png' },
  { href: 'https://www.moe.go.kr/', img: '/images/main/partner3.png' },
  { href: 'https://www.nrf.re.kr/', img: '/images/main/partner4.png' },
  { href: 'https://www.koica.go.kr/', img: '/images/main/partner5.png' },
  { href: 'https://med.kg/', img: '/images/main/partner6.png' },
  { href: 'https://saksalamat.kg/kgz/', img: '/images/main/partner8.png' },
  { href: 'https://edu.gov.kg/', img: '/images/main/partner7.png' },
  { href: 'https://www.gknf.or.kr/', img: '/images/main/partner9.png' },
  { href: 'https://ime.kg/', img: '/images/main/partner10.png' },
  { href: 'https://medipeace.org/', img: '/images/main/partner11.png' },
  { href: 'https://www.unicef.org/', img: '/images/main/partner12.png' },
  { href: '', img: '/images/main/partner13.png' },
  { href: '', img: '/images/main/partner14.png' },
  { href: '', img: '/images/main/partner15.png' },
  { href: 'http://assd.med.kg/', img: '/images/main/partner16.png' },
  { href: '', img: '/images/main/partner17.png' },
  { href: '', img: '/images/main/partner18.png' },
];

export const HOME: Record<Lang, HomeData> = {
  ko: {
    project: {
      p: 'BRIGHT KYRGYZSTAN',
      h2: '브라이트 키르기즈스탄',
      items: [
        { href: '/projects/lupic', img: '/images/main/main_project3.png', tit: '국제협력선도대학 육성지원사업' },
        { href: '/projects/ges', img: '/images/main/main_project2.png', tit: '간호교육정책 수립사업' },
        { href: '/projects/child-health', img: '/images/main/main_project1.png', tit: '아동건강 증진사업' },
      ],
    },
    notice: { p: 'NOTICE', h2: '새로운 소식을 만나보세요', h3: ['사회적 영향', '뉴스', '참여방법'] },
    apply: {
      href: '/join',
      img: '/images/main/apply_img.png',
      cate: '참여방법',
      h4: 'Bright Kyrgyzstan이 함께합니다.',
      txt: '해당 상자를 클릭하시면 Bright Kyrgyzstan 과 <br>함께할 수 있는 방법을 확인할 수 있습니다.',
    },
    partner: { p: 'PARTNERS', h2: '협력기관' },
    prevBtn: '이전',
    nextBtn: '다음',
  },

  en: {
    project: {
      p: 'BRIGHT KYRGYZSTAN',
      h2: 'Bright Kyrgyzstan',
      items: [
        { href: '/projects/lupic', img: '/images/main/main_project3.png', tit: 'Leading University Project for International Cooperation' },
        { href: '/projects/ges', img: '/images/main/main_project2.png', tit: 'Global Educational Support' },
        { href: '/projects/child-health', img: '/images/main/main_project1.png', tit: 'Child Health Promotion Project' },
      ],
    },
    notice: { p: 'NOTICE', h2: 'Latest news', h3: ['Social impact', 'News', 'Join us'] },
    apply: {
      href: '/join',
      img: '/images/main/apply_img.png',
      cate: 'Join us',
      h4: 'Together with Bright Kyrgyzstan',
      txt: "To join us and learn more about participating, <br>click 'Join us' box on the top",
    },
    partner: { p: 'PARTNERS', h2: 'Partners' },
    prevBtn: '이전',
    nextBtn: '다음',
  },

  ky: {
    project: {
      p: 'BRIGHT KYRGYZSTAN',
      h2: 'Жаркын Кыргызстан',
      items: [
        { href: '/projects/lupic', img: '/images/main/main_project3.png', tit: 'Алдыңкы университеттердин<br>эл аралык кызматташтыгын<br>колдоо долбоору' },
        { href: '/projects/ges', img: '/images/main/main_project2.png', tit: 'Билим берүүнү<br>глобалдык колдоо' },
        { href: '/projects/child-health', img: '/images/main/main_project1.png', tit: 'Балдардын ден соолугун чыңдоо<br>долбоору' },
      ],
    },
    notice: { p: 'NOTICE', h2: 'Соңку жаңылыктар', h3: ['Коомдук таасир', 'Жаңылыктар', 'Бизге кошулуңуздар'] },
    apply: {
      href: '/join',
      img: '/images/main/apply_img.png',
      cate: 'Бизге кошулуңуздар',
      h4: 'Жаркын Кыргызстан сиздер менен',
      txt: 'Катышуу барагына өтүү жана катышуу жолдорун <br>билүү үчүн тиешелүү кутучаны басыңыз',
    },
    partner: { p: 'PARTNERS', h2: 'Кызматташуу' },
    prevBtn: '이전',
    nextBtn: '다음',
  },

  ru: {
    project: {
      p: 'BRIGHT KYRGYZSTAN',
      h2: 'Жаркын Кыргызстан',
      items: [
        { href: '/projects/lupic', img: '/images/main/main_project3.png', tit: 'Проект по Поддержке<br>Международного Сотрудничества<br>Ведущих Университетов' },
        { href: '/projects/ges', img: '/images/main/main_project2.png', tit: 'Глобальная Поддержка<br>Образования' },
        { href: '/projects/child-health', img: '/images/main/main_project1.png', tit: 'Проект по Укреплению<br>Здоровья Детей' },
      ],
    },
    notice: { p: 'NOTICE', h2: 'Последние новости', h3: ['Общественный Вклад', 'Новости', 'Принять участие'] },
    apply: {
      href: '/join',
      img: '/images/main/apply_img.png',
      cate: 'Присоединяйтесь к нам',
      h4: 'Вместе с Жаркын Кыргызстан',
      txt: 'Чтобы узнать подробнее о том, <br> как принять участие в проекте, <br> нажмите на «Принять участие»',
    },
    partner: { p: 'PARTNERS', h2: 'Партнеры проекта' },
    prevBtn: '이전',
    nextBtn: '다음',
  },
};
