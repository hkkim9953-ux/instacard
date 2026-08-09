# CardVibe AI — 인스타그램 카드뉴스 자동 생성 Web App 기획서

## 1. 프로젝트 개요 & 비전

| 항목 | 내용 |
|------|------|
| 제품명 (가칭) | **CardVibe AI (카드바이브 AI)** |
| 한 줄 정의 | 블로그 글, 노션 메모, 혹은 아이디어 단 한 줄을 넣으면 **1분 만에** 인스타그램 맞춤형 카드뉴스 템플릿과 원고를 자동 생성·편집·다운로드해 주는 AI SaaS |
| 저장소 / 폴더 | `c:\work\instacard` |

### 타깃 고객

- 퍼스널 브랜딩을 시작하려는 1인 창업가 / 개발자 / 크리에이터
- 인스타그램 마케팅 콘텐츠 제작 시간을 아끼고 싶은 소상공인 & 마케터

### 핵심 가치

> 디자인 감각이 없어도, 캔바(Canva)에서 일일이 수정하지 않아도,  
> 인스타그램 핏(Fit)에 딱 맞는 **1080×1350** 카드뉴스를 **30초 만에** 완벽 생성

---

## 2. 주요 기능 및 UX/UI 디렉팅

### ① 텍스트-투-카드뉴스 (Text to Card-News) Engine

- **원문 변환**: 긴 아티클, 유튜브 스크립트, 대화 내용, 단어 키워드를 입력받아 인스타그램 카드뉴스 규격(**5~10장**)으로 슬라이드 자동 분할
- **스토리라인 자동 구성**
  - **1장 (Hooking)**: 조회수를 올리는 강력한 헤드라인 + 서브타이틀
  - **2~N장 (Body)**: 핵심 정보 요약 (3줄 이내 요약 문구 + 강조 키워드)
  - **마지막 장 (CTA)**: 저장/공유 유도, 댓글 반응 유도, 프로필 링크 유도

### ② 인플루언서 핏 디자인 시스템

- **인스타 최적화 비율**: 기본 **4:5 (1080×1350px)** — 피드에서 크게 노출되는 비율
- **트렌디한 템플릿 라이브러리**
  - **Tech / Developer**: 다크모드, 코드 블록 감성, 텍스트 위주 명확한 타이포그래피
  - **Minimal / Lifestyle**: 여백이 살아있는 깔끔한 파스텔 톤 및 고딕 타이포
  - **Informative / News**: 헤드라인이 강조되는 인포그래픽형 배치
- **실시간 WYSIWYG 편집기**: AI가 만든 레이아웃을 클릭으로 문구 수정, 폰트 크기 변경, 배경색/포인트 컬러 스위칭

### ③ Export & 자동화 지원

- **고화질 렌더링**: Zip 파일(PNG/JPG) 하나로 통째로 다운로드
- **캡션 & 해시태그 추천**: 카드뉴스 내용 기반 인스타 게시물 본문·추천 해시태그 세트 자동 생성

---

## 3. 추천 기술 스택

| 영역 | 선택 |
|------|------|
| Frontend / API | Next.js (App Router, React) |
| Styling / UI | Tailwind CSS (+ 추후 shadcn/ui, Lucide Icons) |
| Canvas / Export | html2canvas (추후 Satori/@vercel/og 검토) |
| AI API | Google Gemini (텍스트 구조화) |
| Database / Auth | Firebase Auth + Firestore (유저, 프로젝트 저장, Security Rules) |
| Payment | Lemon Squeezy (글로벌) 또는 PortOne (국내 PG) |
| Hosting | Vercel |

**현재 구현 스택 (MVP)**

- Next.js 16 + React 19 + Tailwind CSS 4 + TypeScript
- 로컬 슬라이드 분할 엔진 (`src/lib/card.ts`)
- html2canvas + JSZip + file-saver (PNG ZIP 다운로드)

---

## 4. 데이터베이스 스키마 (Firebase Firestore 기준)

```
// Collection: projects/{projectId}
{
  userId: string,          // Firebase Auth uid
  title: string,
  themeId: string,         // 'tech-dark' | 'minimal-light' | 'bold-brand'
  themeConfig: map,
  slides: array,           // CardSlideData[]
  captionText: string | null,
  hashtags: string[],
  sourceText: string | null,
  createdAt: timestamp,
  updatedAt: timestamp
}
// Auth: Firebase Auth (Google / Email magic link)
// Rules: firestore.rules (본인 userId만 CRUD)
```

> Auth·프로젝트 저장은 Firebase로 동작합니다. 월 3회 생성 제한은 이후 단계입니다.

---

## 5. MVP 단계별 개발 로드맵 (2주 완성 플랜)

### Week 1

| 일정 | 목표 | 상태 |
|------|------|------|
| Day 1~3 | 기획 & 프롬프트 튜닝, UI Wireframe, `{ slides: [...] }` JSON 출력 설계 | 기획서 반영 완료 |
| Day 4~7 | 캔버스 렌더링: 4:5 HTML 슬라이드 + PNG 변환/다운로드 엔진 | **구현됨** |

### Week 2

| 일정 | 목표 | 상태 |
|------|------|------|
| Day 8~11 | 템플릿 3종 고도화 & WYSIWYG 편집기 | 템플릿 3종 초안 완료 / 편집기 예정 |
| Day 12~14 | Firebase 인증·프로젝트 저장, 무료 월 3회 제한, Vercel 배포 | Auth·저장 구현됨 / 월 제한·배포 예정 |

### 현재 동작하는 MVP 플로우

1. 원문 입력 (블로그/메모/키워드)
2. **카드뉴스 생성** → Hook / Body / CTA 슬라이드 자동 분할
3. Tech · Minimal · News 템플릿 선택
4. 4:5 미리보기
5. **PNG ZIP 다운로드** + 캡션·해시태그 초안 표시

```bash
cd c:\work\instacard
npm install
npm run dev
```

→ http://localhost:3000

---

## 6. 수익화 모델 (Monetization)

### Freemium

| 플랜 | 내용 |
|------|------|
| **Free** | 월 3회 생성, 하단에 소형 워터마크 노출 |
| **Pro** ($12/월 또는 14,900원/월) | 무제한 생성, 워터마크 제거, 커스텀 폰트/브랜드 컬러 저장, AI 게시물 캡션 자동 생성 |

---

## 7. 화면·데이터 구조 (앱 내부)

### 슬라이드 JSON (앱 기준)

```ts
type Slide = {
  id: string;
  role: "hook" | "body" | "cta";
  slideNumber: number;
  headline: string;
  subtext: string;
  bullets: string[];
  badge: string;
};
```

### 주요 파일

| 경로 | 역할 |
|------|------|
| `src/lib/card.ts` | 타입, 템플릿 3종, 로컬 생성, 캡션/해시태그 |
| `src/components/SlideCard.tsx` | 4:5 슬라이드 UI |
| `src/components/Studio.tsx` | 입력·생성·미리보기·ZIP 다운로드 |
| `src/app/page.tsx` | 스튜디오 진입점 |

---

## 8. 다음 우선순위 (권장)

1. **Gemini API** — `/api/generate`로 `{ slides }` JSON 구조화 (gemini-2.5-flash)
2. **WYSIWYG** — 슬라이드 문구 클릭 편집
3. **Firebase** — 로그인·프로젝트 저장·월 3회 제한
4. **Vercel 배포** + 결제(Pro)

---

## 9. 성공 지표 (초기)

- 입력 → 첫 ZIP 다운로드까지 **1분 이내**
- Free 전환율 / Pro 전환율 추적 (배포 후)
- 생성 완료율 (생성 클릭 대비 ZIP 다운로드 비율)
