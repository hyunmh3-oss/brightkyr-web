import { defineConfig } from 'astro/config';

export default defineConfig({
  // 최종 주소. canonical·og:url·hreflang 이 이 값을 쓴다.
  // 임시 주소(workers.dev)로 운영하는 동안에도 정식 주소를 가리키게 둔다.
  site: 'https://brightkyr.khu.ac.kr',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
  devToolbar: { enabled: false },

  // 원본과 동일한 주소 구조:
  //   한국어  /            (접두사 없음)
  //   영어    /en/...
  //   키르기즈 /ky/...
  //   러시아어 /ru/...
  i18n: {
    defaultLocale: 'ko',
    locales: ['ko', 'en', 'ky', 'ru'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
