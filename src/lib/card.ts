import type { CardSlideData } from "@/components/CardSlide";

function cleanLines(text: string): string[] {
  return text
    .replace(/\r/g, "")
    .split(/\n+/)
    .map((l) => l.replace(/^[-*•\d.)\s]+/, "").trim())
    .filter(Boolean);
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/** MVP: API 없이 로컬에서 5~8장 슬라이드 생성 */
export function generateSlidesLocal(raw: string): CardSlideData[] {
  const lines = cleanLines(raw);
  const joined = lines.join(" ");
  const title =
    lines[0]?.slice(0, 42) ||
    joined.slice(0, 36) ||
    "한 줄로 시작하는 인사이트";

  const bodyLines =
    lines.length > 1 ? lines.slice(1) : joined.match(/.{1,48}/g) ?? [joined];

  const groups = chunk(bodyLines, 3).slice(0, 5);
  if (groups.length === 0) groups.push([title]);

  const slides: CardSlideData[] = [
    {
      slideNumber: 1,
      type: "COVER",
      headline: title,
      subtext: "30초 만에 핵심만 정리한 카드뉴스",
      bodyBullets: [],
      badge: "CARDVIBE",
    },
  ];

  groups.forEach((g, i) => {
    slides.push({
      slideNumber: slides.length + 1,
      type: "BODY",
      headline: g[0]!.slice(0, 36),
      subtext: "핵심 포인트",
      bodyBullets: g.slice(0, 3).map((x) => x.slice(0, 48)),
      badge: `POINT ${i + 1}`,
    });
  });

  slides.push({
    slideNumber: slides.length + 1,
    type: "CTA",
    headline: "저장하고 다시 보세요",
    subtext: "도움이 됐다면 저장 · 공유 · 팔로우",
    bodyBullets: [],
    badge: "CTA",
  });

  return slides;
}
