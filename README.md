# CardVibe AI

인스타그램용 **카드뉴스 자동 제작** 웹앱 (폴더: `instacard`).

> 상세 기획서는 [`docs/PRD.md`](./docs/PRD.md) 를 보세요.

## 한 줄 정의

블로그 글·노션 메모·아이디어 한 줄을 넣으면 **1080×1350(4:5)** 카드뉴스와 캡션을 자동 생성·다운로드합니다.

## 현재 MVP

- 텍스트 → Hook / Body / CTA 슬라이드 자동 분할
- 템플릿 3종: Tech · Minimal · News
- PNG ZIP 다운로드
- 캡션·해시태그 초안

## 실행

```bash
npm install
npm run dev
```

http://localhost:3000

## 기술 스택

- Next.js 16 (App Router) · React 19 · Tailwind CSS 4 · TypeScript
- Auth / DB: Firebase Auth + Firestore (`cardvibe-ai`)
- Export: html2canvas · JSZip

## Firebase

프로젝트: [cardvibe-ai](https://console.firebase.google.com/project/cardvibe-ai/overview)

1. `.env.local` 에 `GEMINI_API_KEY` 를 넣으세요. (Firebase 웹 키는 이미 채워짐)
2. Console → Authentication → **시작하기** 한 번 클릭
3. Sign-in method에서 **Google**, **이메일 링크** 사용 설정
4. Firestore rules/indexes는 배포됨 (`firebase deploy --only firestore`)

```bash
npm run dev
```
