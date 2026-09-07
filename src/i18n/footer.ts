import type { Lang } from './nav';

export interface FooterData {
  contactTitle: string;
  address: string[];
  sitemapTitle: string;
  sitemap: { label: string; href: string }[];
  langTitle: string;
  privacyTitle: string;
  /** 원본과 같이 fancybox 팝업으로 연다. cls 가 script.js 의 바인딩 대상이다. */
  privacy: { label: string; href: string; cls: string }[];
  copyright: string;
}

/** 원본 사이트 푸터를 언어별로 그대로 옮긴 것 */
export const FOOTER: Record<Lang, FooterData> = {
  ko: {
    contactTitle: '연락처',
    address: [
      '경희대학교 NURSphere lab',
      '주소 : 서울특별시 동대문구 경희대로 26 경희대학교 간호과학대학 122호',
      'TEL : 02-961-0313',
      'E-MAIL : brightkyrgyzstan@khu.ac.kr',
    ],
    sitemapTitle: '사이트맵',
    sitemap: [
      { label: '브라이트 키르기즈스탄', href: '/about' },
      { label: '프로젝트', href: '/projects/lupic' },
      { label: '소식', href: '/news' },
      { label: '참여방법', href: '/join' },
    ],
    langTitle: '언어',
    privacyTitle: '개인정보',
    privacy: [
      { label: '개인정보처리방침', href: '/sub/pop_privacy.html', cls: 'pop_privacy' },
      { label: '이메일무단수집거부', href: '/sub/pop_email.html', cls: 'pop_email' },
    ],
    copyright: 'COPYRIGHT © 2022 경희대학교 NURSphere lab. ALL RIGHTS RESERVED.',
  },

  en: {
    contactTitle: 'Contact us',
    address: [
      'Kyung Hee University, NURSphere lab',
      'Address: Room # 122, Space 21, 26, Kyungheedae-ro Dongdaemun-gu, Seoul, 02447, Republic of Korea',
      'TEL: +82-2-961-0313',
      'E-MAIL: brightkyrgyzstan@khu.ac.kr',
    ],
    sitemapTitle: 'Site map',
    sitemap: [
      { label: 'Bright Kyrgyzstan', href: '/about' },
      { label: 'Projects', href: '/projects/lupic' },
      { label: 'Info', href: '/news' },
      { label: 'Join us', href: '/join' },
    ],
    langTitle: 'Languages',
    privacyTitle: 'Personal information',
    privacy: [
      { label: 'Privacy policy', href: '/sub/pop_privacy.html', cls: 'pop_privacy' },
      { label: 'Decline collection of email adress', href: '/sub/pop_email.html', cls: 'pop_email' },
    ],
    copyright: 'COPYRIGHT © 2022 Kyung Hee University NURSphere lab. ALL RIGHTS RESERVED.',
  },

  ky: {
    contactTitle: 'Биздин дарегибиз',
    address: [
      'Биздин дарегибиз:',
      'Сеул ш., Дондемун р-ну, Кёнхи-даэро көч. №26, Университети, Мээрмандык иш кафедрасы, 122-чи каб.',
      'Тел: +82-2-961-0313',
      'E-mail: brightkyrgyzstan@khu.ac.kr',
    ],
    sitemapTitle: 'Сайттын картасы',
    sitemap: [
      { label: 'Жаркын Кыргызстан', href: '/about' },
      { label: 'Долбоорлор', href: '/projects/lupic' },
      { label: 'Маалымат', href: '/news' },
      { label: 'Бизге кошулуңуздар', href: '/join' },
    ],
    langTitle: 'Тил',
    privacyTitle: 'Жеке маалымат',
    privacy: [
      { label: 'Жеке маалыматтардын купуялык саясаты', href: '/sub/pop_privacy.html', cls: 'pop_privacy' },
      { label: 'Электрондук почтаны берүүдөн баш тартуу', href: '/sub/pop_email.html', cls: 'pop_email' },
    ],
    copyright: 'COPYRIGHT © 2022 Kyung Hee University NURSphere lab. ALL RIGHTS RESERVED.',
  },

  ru: {
    contactTitle: 'Контактные данные',
    address: [
      'NURSphere Lab, Университет Кёнг Хи',
      'Адрес: г. Сеул, р-н Дондемун, ул. Кёнхи-даэро, 26, Университет Кёнг-Хи, кафедра сестринского дела, каб.122',
      'Тел: +82-2-961-0313',
      'E-mail: brightkyrgyzstan@khu.ac.kr',
    ],
    sitemapTitle: 'Карта сайта',
    sitemap: [
      { label: 'Жаркын Кыргызстан', href: '/about' },
      { label: 'Проекты', href: '/projects/lupic' },
      { label: 'Информация', href: '/news' },
      { label: 'Принять участие', href: '/join' },
    ],
    langTitle: 'Язык',
    privacyTitle: 'Персональные данные',
    privacy: [
      { label: 'Управление личными данными', href: '/sub/pop_privacy.html', cls: 'pop_privacy' },
      { label: 'Отказ от сбора электронной почты', href: '/sub/pop_email.html', cls: 'pop_email' },
    ],
    copyright: 'COPYRIGHT © 2022 Kyung Hee University NURSphere lab. ALL RIGHTS RESERVED.',
  },
};

export const SNS = [
  { name: 'Facebook', href: 'https://facebook.com/brightkyrgyzstan/', icon: '/images/common/sns1_x2.png' },
  { name: 'Instagram', href: 'https://www.instagram.com/brightkyrgyzstan/', icon: '/images/common/sns2_x2.png' },
  // 원본 헤더의 세 번째 아이콘 — NURSphere 연구실 사이트로 연결된다.
  { name: 'NURSphere Lab', href: 'https://healthcaresimulation.khu.ac.kr', icon: '/images/common/sns3_x2.png' },
];
