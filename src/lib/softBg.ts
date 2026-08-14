import { GoogleGenerativeAI } from "@google/generative-ai";
import sharp from "sharp";

const IMAGE_MODEL = "gemini-2.5-flash-image";

function topicPrompt(topic: string) {
  const cleaned = topic
    .replace(/[#"'\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 140);
  return [
    "Generate one soft photographic background image for an Instagram card.",
    `Subject / theme: ${cleaned || "modern lifestyle workspace"}.`,
    "Style: muted pastel, low contrast, gentle bokeh, atmospheric.",
    "Leave empty soft areas for overlay text.",
    "No typography, no logos, no watermarks, no UI mockups.",
    "Vertical 4:5 composition.",
  ].join(" ");
}

export async function toSoftJpegDataUrl(input: Buffer): Promise<string | null> {
  try {
    const jpeg = await sharp(input)
      .resize(720, 900, { fit: "cover", position: "attention" })
      .jpeg({ quality: 72, mozjpeg: true })
      .toBuffer();
    if (jpeg.byteLength < 800 || jpeg.byteLength > 700_000) return null;
    return `data:image/jpeg;base64,${jpeg.toString("base64")}`;
  } catch {
    return null;
  }
}

/** 수동 업로드 data URL → 카드용 연한 JPEG */
export async function normalizeBgDataUrl(
  dataUrl: string,
): Promise<string | null> {
  const m = dataUrl.match(/^data:image\/[\w+.+-]+;base64,([A-Za-z0-9+/=\s]+)$/);
  if (!m?.[1]) return null;
  const buf = Buffer.from(m[1].replace(/\s/g, ""), "base64");
  if (buf.byteLength < 800 || buf.byteLength > 4_000_000) return null;
  return toSoftJpegDataUrl(buf);
}

async function fromGemini(topic: string, apiKey: string): Promise<string | null> {
  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: IMAGE_MODEL,
      // @ts-expect-error responseModalities exists on image models
      generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
    });
    const result = await model.generateContent(topicPrompt(topic));
    const parts = result.response.candidates?.[0]?.content?.parts ?? [];
    const inline = parts.find((p) => p.inlineData?.data)?.inlineData;
    if (!inline?.data) return null;
    return toSoftJpegDataUrl(Buffer.from(inline.data, "base64"));
  } catch (e) {
    console.error("[softBg/gemini]", e instanceof Error ? e.message : e);
    return null;
  }
}

async function fromPollinations(topic: string): Promise<string | null> {
  const cleaned = topic
    .replace(/[#"'\\]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
  if (!cleaned) return null;

  const prompt = [
    "soft faded photographic background",
    cleaned,
    "muted pastel colors",
    "low contrast",
    "gentle bokeh",
    "empty space for text",
    "no typography",
    "no logo",
    "no watermark",
  ].join(", ");

  const url =
    `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}` +
    `?width=720&height=900&nologo=true`;

  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(50_000),
      headers: { Accept: "image/*" },
    });
    if (!res.ok) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    return toSoftJpegDataUrl(buf);
  } catch (e) {
    console.error("[softBg/pollinations]", e instanceof Error ? e.message : e);
    return null;
  }
}

/** 주제 키워드 → 연한 배경 JPEG data URL */
export async function fetchSoftBgDataUrl(topic: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (apiKey) {
    const gemini = await fromGemini(topic, apiKey);
    if (gemini) return gemini;
  }
  return fromPollinations(topic);
}
