import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  GENERATE_SYSTEM_PROMPT,
  type GenerateResult,
  type GenerateSlide,
  type GenerateSlideType,
} from "@/lib/generateSchema";
import { fetchSoftBgDataUrl, normalizeBgDataUrl } from "@/lib/softBg";

export const runtime = "nodejs";
export const maxDuration = 90;

const MAX_INPUT_CHARS = 12_000;
const MAX_GUIDE_CHARS = 800;
const MODEL = process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";
const SLIDE_TYPES = new Set<GenerateSlideType>(["COVER", "BODY", "CTA"]);

type RequestBody = {
  text?: unknown;
  mood?: unknown;
  details?: unknown;
  bgImage?: unknown;
};

function badRequest(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function asString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((v): v is string => typeof v === "string" && v.trim().length > 0);
}

function parseSlide(raw: unknown, index: number): GenerateSlide | null {
  if (!raw || typeof raw !== "object") return null;
  const s = raw as Record<string, unknown>;
  const type = asString(s.type);
  if (!type || !SLIDE_TYPES.has(type as GenerateSlideType)) return null;

  const headline = asString(s.headline)?.trim();
  if (!headline) return null;

  return {
    slideNumber:
      typeof s.slideNumber === "number" && Number.isFinite(s.slideNumber)
        ? s.slideNumber
        : index + 1,
    type: type as GenerateSlideType,
    badge: asString(s.badge)?.trim() || "",
    headline,
    subtext: asString(s.subtext)?.trim() || "",
    bodyBullets: asStringArray(s.bodyBullets),
  };
}

function parseGenerateResult(raw: unknown): GenerateResult | null {
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as Record<string, unknown>;
  const title = asString(obj.title)?.trim();
  if (!title || !Array.isArray(obj.slides)) return null;

  const slides = obj.slides
    .map((s, i) => parseSlide(s, i))
    .filter((s): s is GenerateSlide => s != null);

  if (slides.length < 5 || slides.length > 8) return null;
  if (slides[0]?.type !== "COVER") return null;
  if (slides[slides.length - 1]?.type !== "CTA") return null;

  return {
    title,
    slides: slides.map((s, i) => ({ ...s, slideNumber: i + 1 })),
    caption: asString(obj.caption)?.trim() || title,
    hashtags: asStringArray(obj.hashtags),
    bgPrompt: asString(obj.bgPrompt)?.trim() || undefined,
  };
}

function extractJsonText(text: string): string {
  const trimmed = text.trim();
  const fence = trimmed.match(/^```(?:json)?\s*([\s\S]*?)```$/i);
  return fence?.[1]?.trim() || trimmed;
}

function clipGuide(value: string | null): string {
  return (value ?? "").trim().slice(0, MAX_GUIDE_CHARS);
}

export async function POST(req: Request) {
  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return badRequest("요청 본문이 올바른 JSON이 아닙니다.");
  }

  const text = asString(body.text)?.trim();
  if (!text) {
    return badRequest("text 필드가 필요합니다.");
  }
  if (text.length > MAX_INPUT_CHARS) {
    return badRequest(`원문은 ${MAX_INPUT_CHARS.toLocaleString("ko-KR")}자 이하여야 합니다.`);
  }

  const mood = clipGuide(asString(body.mood));
  const details = clipGuide(asString(body.details));
  const uploadedBg = asString(body.bgImage)?.trim() || "";

  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY가 설정되지 않았습니다." },
      { status: 500 },
    );
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction: GENERATE_SYSTEM_PROMPT,
      generationConfig: {
        temperature: 0.7,
        responseMimeType: "application/json",
      },
    });

    const guideBlock = [
      mood ? `전체 분위기: ${mood}` : "",
      details ? `세부사항: ${details}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    const prompt = [
      "다음 원문을 인스타그램 카드뉴스 JSON으로 변환해 주세요.",
      guideBlock ? `\n[사용자 지정]\n${guideBlock}\n` : "",
      `\n---\n${text}\n---`,
    ].join("");

    const result = await model.generateContent(prompt);
    const content = result.response.text();
    if (!content?.trim()) {
      return NextResponse.json(
        { error: "모델 응답이 비어 있습니다." },
        { status: 502 },
      );
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(extractJsonText(content));
    } catch {
      return NextResponse.json(
        { error: "모델이 유효한 JSON을 반환하지 않았습니다." },
        { status: 502 },
      );
    }

    const parsed = parseGenerateResult(parsedJson);
    if (!parsed) {
      return NextResponse.json(
        {
          error:
            "응답 JSON 형식이 올바르지 않습니다. (5~8장, COVER 시작, CTA 종료 필요)",
        },
        { status: 502 },
      );
    }

    let bgImage: string | null = null;
    if (uploadedBg.startsWith("data:image/")) {
      bgImage =
        (await normalizeBgDataUrl(uploadedBg)) ||
        (uploadedBg.length <= 900_000 ? uploadedBg : null);
    } else {
      const topic = [
        parsed.bgPrompt,
        mood,
        details,
        parsed.title,
        parsed.slides[0]?.headline,
        parsed.slides[0]?.badge,
      ]
        .filter(Boolean)
        .join(" ");
      bgImage = await fetchSoftBgDataUrl(topic);
    }

    return NextResponse.json({ ...parsed, bgImage });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : "카드뉴스 생성 중 오류가 발생했습니다.";
    console.error("[api/generate]", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
