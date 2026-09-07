/**
 * 자료실·회원 화면 문구.
 *
 * 자료실은 **러시아어판에만** 있다 (자료 97건이 전부 러시아어이고
 * 원본도 러시아어판 `pds_ru` 에만 실제 자료가 있었다).
 * 그래서 러시아어를 기본으로 쓰되, 관리자가 확인할 때를 위해 한국어도 함께 둔다.
 */

export type UiLang = 'ru' | 'ko';

export const LIB = {
  ru: {
    // 화면 이름
    library: 'Архив документов',
    login: 'Войти',
    join: 'Присоединиться',
    logout: 'Выйти',
    mypage: 'Моя страница',

    // 로그인
    idLabel: 'ID (Логин)',
    pwLabel: 'Password (Пароль)',
    saveId: 'Запомнить логин',
    loginBtn: 'Войти',
    toJoin: 'Ещё нет аккаунта? Зарегистрируйтесь',
    loginNeeded: 'Этот раздел доступен только зарегистрированным пользователям.',

    // 가입
    joinTitle: 'Регистрация',
    nameLabel: 'Имя',
    emailLabel: 'Электронная почта',
    pwConfirm: 'Повторите пароль',
    agreeAll: 'Согласиться со всем',
    agreeTerms: 'Условия использования (обязательно)',
    agreePrivacy: 'Обработка персональных данных (обязательно)',
    detail: 'Подробнее',
    joinBtn: 'Зарегистрироваться',
    toLogin: 'Уже есть аккаунт? Войти',

    // 안내·오류
    required: 'Заполните все обязательные поля.',
    pwMismatch: 'Пароли не совпадают.',
    pwTooShort: 'Пароль должен содержать не менее 10 знаков.',
    idTaken: 'Этот логин уже занят.',
    idRule: 'Логин: 4–20 знаков, латиница и цифры.',
    loginFailed: 'Неверный логин или пароль.',
    captchaNeeded: 'Подтвердите, что вы не робот.',
    captchaFailed: 'Проверка не пройдена. Попробуйте ещё раз.',
    joined: 'Регистрация завершена. Теперь вы можете войти.',
    serverError: 'Ошибка сервера. Попробуйте позже.',

    // 목록
    all: 'Все',
    search: 'Поиск',
    keyword: 'Поиск по сайту',
    empty: 'Записи не найдены.',
    notice: '공지',
    attach: 'Вложения',
    hit: 'Просмотры',
    list: 'Список',
    newer: 'следующий',
    older: 'предыдущий',
    th: ['№', 'Категория', 'Заголовок', 'Автор', 'Дата', 'Просмотры'],
    first: '처음페이지',
    last: '마지막페이지',
  },

  ko: {
    library: '자료실',
    login: '로그인',
    join: '회원가입',
    logout: '로그아웃',
    mypage: '내 정보',

    idLabel: '아이디',
    pwLabel: '비밀번호',
    saveId: '아이디 저장',
    loginBtn: '로그인',
    toJoin: '아직 회원이 아니신가요? 가입하기',
    loginNeeded: '이 자료실은 회원만 이용할 수 있습니다.',

    joinTitle: '회원가입',
    nameLabel: '이름',
    emailLabel: '이메일',
    pwConfirm: '비밀번호 확인',
    agreeAll: '전체 동의',
    agreeTerms: '이용약관 동의 (필수)',
    agreePrivacy: '개인정보 수집·이용 동의 (필수)',
    detail: '자세히',
    joinBtn: '가입하기',
    toLogin: '이미 회원이신가요? 로그인',

    required: '빈 칸을 채워 주세요.',
    pwMismatch: '비밀번호가 서로 다릅니다.',
    pwTooShort: '비밀번호는 10자 이상이어야 합니다.',
    idTaken: '이미 쓰이고 있는 아이디입니다.',
    idRule: '아이디는 영문·숫자 4~20자입니다.',
    loginFailed: '아이디 또는 비밀번호가 맞지 않습니다.',
    captchaNeeded: '사람인지 확인해 주세요.',
    captchaFailed: '확인에 실패했습니다. 다시 시도해 주세요.',
    joined: '가입이 끝났습니다. 이제 로그인할 수 있습니다.',
    serverError: '서버 오류입니다. 잠시 후 다시 시도해 주세요.',

    all: '전체',
    search: '검색하기',
    keyword: '검색어',
    empty: '등록된 게시물이 없습니다.',
    notice: '공지',
    attach: '첨부파일',
    hit: '조회수',
    list: '목록',
    newer: '다음글',
    older: '이전글',
    th: ['번호', '카테고리', '제목', '작성자', '등록일', '조회'],
    first: '처음페이지',
    last: '마지막페이지',
  },
} as const;

/** 자료실 분류 — 원본 순서 그대로 */
export const LIB_CATS = [
  'Policy / Политика',
  'Curriculum / Учебные планы',
  'Teaching & Innovation / Обучение и инновации',
  'Research Capacity / Научный потенциал',
  'Clinical Capacity / Клинический потенциал',
  'Professional Development / Профразвитие',
  'Others / Прочее',
];

/** 파일 크기를 사람이 읽는 형태로 (원본이 "(957.3 KB)" 처럼 표시한다) */
export function fileSize(bytes: number): string {
  if (!bytes) return '';
  if (bytes >= 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + ' MB';
  return (bytes / 1024).toFixed(1) + ' KB';
}
