import type { CardSlideData, CardSlideType } from "@/components/CardSlide";

export type GenerateSlideType = "COVER" | "BODY" | "CTA";

export type GenerateSlide = {
  slideNumber: number;
  type: GenerateSlideType;
  badge: string;
  headline: string;
  subtext: string;
  bodyBullets: string[];
};

export type GenerateResult = {
  title: string;
  slides: GenerateSlide[];
  caption: string;
  hashtags: string[];
  /** 영문 배경 키워드 (이미지 생성용) */
  bgPrompt?: string;
  /** 연한 배경 이미지 data URL */
  bgImage?: string | null;
};

/** API 응답 → CardSlide 데이터 */
export function toCardSlides(result: GenerateResult): CardSlideData[] {
  return result.slides.map((s, i) => ({
    slideNumber: s.slideNumber || i + 1,
    type: s.type as CardSlideType,
    badge: s.badge || s.type,
    headline: s.headline,
    subtext: s.subtext,
    bodyBullets: s.bodyBullets ?? [],
  }));
}

export const GENERATE_SYSTEM_PROMPT = `당신은 인스타그램 카드뉴스 전문 카피라이터이자 콘텐츠 전략가입니다.
사용자가 준 원문을 분석하여 인스타그램 피드용 카드뉴스 원고로 변환하세요.

규칙:
1. 슬라이드는 반드시 5~8장으로 구성합니다.
2. 1번 슬라이드(type: "COVER")는 시선을 사로잡는 Hooking 헤드라인이어야 합니다.
3. 중간 슬라이드(type: "BODY")는 핵심 정보를 요약합니다. bodyBullets는 3~5개로 충분히 채우고, 각 불릿은 한 줄~두 줄로 작성합니다.
4. 마지막 슬라이드(type: "CTA")는 저장/공유/팔로우/댓글을 유도하는 Call to Action이어야 합니다.
5. 한국어로 작성합니다. 과장된 낚시성 문구는 피하고, 명확하고 세련된 톤을 유지합니다.
6. 반드시 아래 JSON 객체만 출력하세요. 마크다운 코드블록이나 설명 문장을 절대 포함하지 마세요.

JSON 스키마:
{
  "title": "카드뉴스 전체 제목",
  "slides": [
    {
      "slideNumber": 1,
      "type": "COVER",
      "badge": "카테고리/태그",
      "headline": "메인 타이틀",
      "subtext": "서브 타이틀 또는 한 줄 요약",
      "bodyBullets": ["포인트 1", "포인트 2"]
    }
  ],
  "caption": "인스타그램 게시물 본문에 올릴 캡션 글",
  "hashtags": ["#태그1", "#태그2"],
  "bgPrompt": "English visual keywords for a soft photo background (5-12 words, theme of the content, no text)"
}

type은 반드시 "COVER" | "BODY" | "CTA" 중 하나입니다.
COVER는 첫 장에만, CTA는 마지막 장에만 사용하세요.
bgPrompt는 카드 내용과 관련된 배경 사진용 영어 키워드입니다. (예: "personal branding laptop desk warm light")
사용자가 분위기(mood)·세부사항(details)을 주면 톤·카피·bgPrompt에 반영하세요.`
