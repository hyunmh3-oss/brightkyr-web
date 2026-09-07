import type { Lang } from './nav';

/**
 * 메인 화면 팝업.
 *
 * 원본은 백오피스 「팝업 관리」로 띄우던 기능이다. 여기서는 이 파일만 고치면 된다.
 * 이미지는 `public/images/uploaded/popup/` 에 넣고 경로를 적는다.
 *
 * 새 팝업을 띄우려면 `id` 를 **새 값으로** 준다.
 * 방문자의 '오늘하루 열지 않기'는 이 id 로 기억되므로, 같은 id 를 재사용하면
 * 지난번에 체크한 사람에게는 새 팝업도 안 보인다.
 */
export interface PopupItem {
  /** 쿠키 이름에 쓰인다. 새 팝업마다 새 값으로. */
  id: string;
  /** false 로 두면 아예 나오지 않는다 */
  enabled: boolean;
  /** 팝업 이미지 경로 */
  image: string;
  /** 이미지를 누르면 갈 곳. 비우면 링크 없음 */
  link: string;
  /** 이미지 원본 크기 (px) */
  width: number;
  height: number;
  /** 화면 왼쪽·위에서 떨어진 거리 (px) */
  left: number;
  top: number;
  alt: string;
  /** 이 언어에서만 표시. 비우면 4개 언어 전부 */
  langs?: Lang[];
  /** 게시 기간 (YYYY-MM-DD). 비우면 제한 없음. 브라우저 날짜로 판단하므로
   *  기간이 지나면 다시 배포하지 않아도 저절로 사라진다. */
  from?: string;
  until?: string;
}

export const POPUPS: PopupItem[] = [
  {
    id: 'yp-2026-2',
    enabled: true,
    image: '/images/uploaded/popup/67190243139d3b1fa75412f96a7089bc.png',
    link: '/news/74',
    width: 520,
    height: 570,
    left: 100,
    top: 100,
    alt: '2026 하반기 ODA 영프로페셔널(YP) 채용 안내',
    from: '2026-09-07',
    until: '2026-09-18',
  },
];

/** 팝업 안내 문구 — 원본은 모든 언어에서 한국어로 나온다 */
export const POPUP_UI = {
  today: '오늘하루 창 열지 않기',
  close: '[창 닫기]',
  closeTitle: '창 닫기',
};
