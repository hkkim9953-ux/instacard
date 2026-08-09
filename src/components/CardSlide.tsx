"use client";

import type { CSSProperties } from "react";
import { Bookmark, ChevronDown, Heart, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

export type CardSlideType = "COVER" | "BODY" | "CTA";
export type CardThemeId = "tech-dark" | "minimal-light" | "bold-brand";

export type CardSlideData = {
  slideNumber: number;
  type: CardSlideType;
  badge: string;
  headline: string;
  subtext: string;
  bodyBullets: string[];
};

type ThemeTokens = {
  id: CardThemeId;
  label: string;
  bg: string;
  fg: string;
  muted: string;
  accent: string;
  badgeBg: string;
  badgeFg: string;
  surface: string;
  headerBand?: string;
  /** 카드 전체 배경 (그라데이션) */
  canvas: string;
};

export const CARD_THEMES: ThemeTokens[] = [
  {
    id: "tech-dark",
    label: "Tech Dark",
    bg: "#0B1220",
    fg: "#F8FAFC",
    muted: "#94A3B8",
    accent: "#38BDF8",
    badgeBg: "rgba(56,189,248,0.18)",
    badgeFg: "#7DD3FC",
    surface: "rgba(15,23,42,0.55)",
    canvas:
      "radial-gradient(120% 80% at 10% -10%, #1e3a5f 0%, transparent 55%), radial-gradient(90% 70% at 100% 20%, #0ea5e940 0%, transparent 50%), linear-gradient(165deg, #0B1220 0%, #111827 45%, #0f172a 100%)",
  },
  {
    id: "minimal-light",
    label: "Minimal Light",
    bg: "#F3EEE6",
    fg: "#1C1917",
    muted: "#78716C",
    accent: "#1C1917",
    badgeBg: "rgba(28,25,23,0.07)",
    badgeFg: "#44403C",
    surface: "rgba(255,255,255,0.72)",
    canvas:
      "radial-gradient(100% 70% at 0% 0%, #fff 0%, transparent 55%), radial-gradient(80% 60% at 100% 10%, #e7d5c4 0%, transparent 50%), linear-gradient(180deg, #F7F3EC 0%, #EFE8DE 55%, #E8DFD3 100%)",
  },
  {
    id: "bold-brand",
    label: "Bold Brand",
    bg: "#FFF1E6",
    fg: "#111827",
    muted: "#6B7280",
    accent: "#EA580C",
    badgeBg: "#EA580C",
    badgeFg: "#FFFFFF",
    surface: "rgba(255,255,255,0.78)",
    headerBand: "#EA580C",
    canvas:
      "radial-gradient(90% 60% at 85% -5%, #fdba7480 0%, transparent 55%), radial-gradient(70% 50% at 0% 100%, #fb923c40 0%, transparent 50%), linear-gradient(160deg, #FFF7ED 0%, #FFEDD5 40%, #FED7AA 100%)",
  },
];

/** 내보내기·미리보기용 장식 배경 (외부 이미지 없이 CORS 안전) */
function CardAtmosphere({
  themeId,
  soft,
}: {
  themeId: CardThemeId;
  soft?: boolean;
}) {
  const dim = soft ? "opacity-40" : "";
  if (themeId === "tech-dark") {
    return (
      <div
        className={cn(
          "pointer-events-none absolute inset-0 overflow-hidden",
          dim,
        )}
        aria-hidden
      >
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,163,184,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.12) 1px, transparent 1px)",
            backgroundSize: "12% 9.6%",
          }}
        />
        <div className="absolute -right-[18%] -top-[8%] h-[55%] w-[70%] rounded-full bg-[#38BDF8]/20 blur-[40px]" />
        <div className="absolute -bottom-[10%] -left-[20%] h-[45%] w-[65%] rounded-full bg-[#6366F1]/25 blur-[48px]" />
        <div className="absolute bottom-[12%] right-[8%] h-[28%] w-[38%] rounded-[28%] border border-sky-300/25 bg-gradient-to-br from-sky-400/15 to-transparent" />
        <div className="absolute left-[6%] top-[38%] h-[22%] w-[22%] rotate-12 rounded-2xl border border-white/10 bg-white/5" />
        <Grain />
      </div>
    );
  }

  if (themeId === "bold-brand") {
    return (
      <div
        className={cn(
          "pointer-events-none absolute inset-0 overflow-hidden",
          dim,
        )}
        aria-hidden
      >
        <div className="absolute -right-[25%] top-[-5%] h-[50%] w-[70%] rounded-full bg-orange-400/35 blur-[36px]" />
        <div className="absolute -left-[20%] bottom-[-8%] h-[40%] w-[60%] rounded-full bg-amber-300/40 blur-[40px]" />
        <div className="absolute right-[-5%] bottom-[18%] h-[42%] w-[48%] rotate-[-8deg] rounded-[2rem] bg-gradient-to-br from-orange-500/30 via-orange-400/10 to-transparent" />
        <div className="absolute left-[8%] top-[42%] h-[18%] w-[28%] rotate-6 rounded-3xl bg-white/50 shadow-sm" />
        <div
          className="absolute inset-0 opacity-[0.4]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(234,88,12,0.18) 1px, transparent 0)",
            backgroundSize: "4.5% 3.6%",
          }}
        />
        <Grain />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        dim,
      )}
      aria-hidden
    >
      <div className="absolute -right-[10%] top-[-12%] h-[48%] w-[58%] rounded-full bg-[#d6c4b0]/45 blur-[32px]" />
      <div className="absolute -left-[15%] bottom-[-10%] h-[42%] w-[55%] rounded-full bg-[#c9b8a4]/35 blur-[36px]" />
      <div className="absolute bottom-[10%] right-[6%] h-[36%] w-[44%] overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#c4b5a4]/50 to-[#a8907a]/20">
        <div className="absolute inset-[12%] rounded-[1.2rem] border border-white/50 bg-white/25" />
      </div>
      <div className="absolute left-[10%] top-[36%] h-[14%] w-[32%] -rotate-3 rounded-2xl bg-white/60 shadow-[0_8px_24px_rgba(28,25,23,0.06)]" />
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23a8a29e' fill-opacity='0.12'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />
      <Grain />
    </div>
  );
}

function Grain() {
  return (
    <div
      className="absolute inset-0 opacity-[0.22] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  );
}

type EditableProps = {
  value: string;
  className?: string;
  style?: CSSProperties;
  multiline?: boolean;
  onChange: (value: string) => void;
};

function EditableText({
  value,
  className,
  style,
  multiline,
  onChange,
}: EditableProps) {
  return (
    <div
      role="textbox"
      tabIndex={0}
      contentEditable
      suppressContentEditableWarning
      className={cn(
        "outline-none rounded-md transition",
        "hover:ring-1 hover:ring-black/10 focus:ring-2 focus:ring-[var(--edit-ring)]",
        "empty:before:content-[attr(data-placeholder)] empty:before:opacity-40",
        className,
      )}
      style={
        {
          ...style,
          "--edit-ring": "rgba(56,189,248,0.45)",
        } as CSSProperties
      }
      data-placeholder="클릭해서 수정"
      onBlur={(e) => {
        const next = e.currentTarget.innerText.replace(/\u00a0/g, " ").trim();
        if (next !== value) onChange(next);
      }}
      onKeyDown={(e) => {
        if (!multiline && e.key === "Enter") {
          e.preventDefault();
          e.currentTarget.blur();
        }
      }}
    >
      {value}
    </div>
  );
}

type Props = {
  slide: CardSlideData;
  theme: CardThemeId;
  total: number;
  /** 내용 관련 연한 배경 이미지 (data URL 또는 URL) */
  bgImage?: string | null;
  className?: string;
  onChange?: (patch: Partial<CardSlideData>) => void;
};

export function CardSlide({
  slide,
  theme: themeId,
  total,
  bgImage,
  className,
  onChange,
}: Props) {
  const theme =
    CARD_THEMES.find((t) => t.id === themeId) ?? CARD_THEMES[1]!;

  const edit = onChange != null;

  function setField<K extends keyof CardSlideData>(key: K, value: CardSlideData[K]) {
    onChange?.({ [key]: value } as Partial<CardSlideData>);
  }

  function setBullet(index: number, value: string) {
    const next = [...slide.bodyBullets];
    next[index] = value;
    setField("bodyBullets", next);
  }

  const panel =
    slide.type === "BODY" || slide.type === "CTA"
      ? "rounded-[1.25rem] border border-black/5 px-[5.5%] py-[6%] backdrop-blur-[6px]"
      : "";

  return (
    <article
      data-slide-card
      className={cn(
        "@container relative flex aspect-[4/5] w-full flex-col overflow-hidden",
        "rounded-2xl shadow-[0_12px_40px_rgba(15,23,42,0.12)]",
        "px-[8%] py-[7.5%]",
        className,
      )}
      style={{
        background: theme.canvas,
        color: theme.fg,
        fontFamily:
          '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, "Malgun Gothic", sans-serif',
      }}
    >
      {bgImage ? (
        <div className="pointer-events-none absolute inset-0 z-0" aria-hidden>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bgImage}
            alt=""
            className="h-full w-full object-cover"
            draggable={false}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                theme.id === "tech-dark"
                  ? "linear-gradient(180deg, rgba(11,18,32,0.55) 0%, rgba(15,23,42,0.48) 40%, rgba(11,18,32,0.72) 100%)"
                  : theme.id === "bold-brand"
                    ? "linear-gradient(180deg, rgba(255,247,237,0.55) 0%, rgba(255,237,213,0.45) 45%, rgba(254,215,170,0.68) 100%)"
                    : "linear-gradient(180deg, rgba(247,243,236,0.58) 0%, rgba(239,232,222,0.48) 45%, rgba(232,223,211,0.7) 100%)",
            }}
          />
        </div>
      ) : null}

      <CardAtmosphere themeId={theme.id} soft={Boolean(bgImage)} />

      {theme.headerBand && slide.type !== "CTA" ? (
        <div
          className="absolute inset-x-0 top-0 z-[1] h-[7%]"
          style={{ background: theme.headerBand }}
          aria-hidden
        />
      ) : null}

      {slide.type === "COVER" && !bgImage ? (
        <div
          className="pointer-events-none absolute inset-x-[8%] bottom-[14%] z-[1] h-[28%] overflow-hidden rounded-[1.25rem]"
          aria-hidden
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                theme.id === "tech-dark"
                  ? "linear-gradient(135deg, #0ea5e9aa, #1e293b 55%, #334155)"
                  : theme.id === "bold-brand"
                    ? "linear-gradient(135deg, #ea580c, #fb923c 50%, #fdba74)"
                    : "linear-gradient(135deg, #d6c2ae, #b8a090 45%, #9a8574)",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
          <div className="absolute -right-[10%] top-[-20%] h-[80%] w-[55%] rounded-full bg-white/20 blur-2xl" />
        </div>
      ) : null}

      {slide.type === "COVER" && bgImage ? (
        <div
          className="pointer-events-none absolute inset-x-[8%] bottom-[12%] z-[1] h-[30%] overflow-hidden rounded-[1.25rem] border border-white/30 shadow-lg"
          aria-hidden
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bgImage}
            alt=""
            className="h-full w-full scale-110 object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10" />
        </div>
      ) : null}

      <div
        className={cn(
          "relative z-[2] flex items-start justify-between gap-[2%]",
          theme.headerBand && slide.type !== "CTA" ? "mt-[5%]" : "",
        )}
      >
        {edit ? (
          <EditableText
            value={slide.badge}
            onChange={(v) => setField("badge", v)}
            className="inline-flex max-w-[70%] rounded-full px-[2.2%] py-[1%] text-[3.4cqw] font-semibold tracking-wide backdrop-blur-sm"
            style={{ background: theme.badgeBg, color: theme.badgeFg }}
          />
        ) : (
          <span
            className="inline-flex max-w-[70%] rounded-full px-[2.2%] py-[1%] text-[3.4cqw] font-semibold tracking-wide backdrop-blur-sm"
            style={{ background: theme.badgeBg, color: theme.badgeFg }}
          >
            {slide.badge}
          </span>
        )}
        <span
          className="shrink-0 text-[3.1cqw] font-medium tabular-nums"
          style={{ color: theme.muted }}
        >
          {slide.slideNumber}/{total}
        </span>
      </div>

      {slide.type === "COVER" ? (
        <div className="relative z-[2] mt-[6%] flex min-h-0 flex-1 flex-col pb-[8%]">
          {edit ? (
            <EditableText
              value={slide.headline}
              multiline
              onChange={(v) => setField("headline", v)}
              className="text-[8.5cqw] font-bold leading-[1.28] tracking-tight drop-shadow-sm"
            />
          ) : (
            <h2 className="text-[8.5cqw] font-bold leading-[1.28] tracking-tight drop-shadow-sm">
              {slide.headline}
            </h2>
          )}
          {edit ? (
            <EditableText
              value={slide.subtext}
              multiline
              onChange={(v) => setField("subtext", v)}
              className="mt-[5%] max-w-[92%] text-[4.7cqw] leading-[1.5]"
              style={{ color: theme.muted }}
            />
          ) : (
            <p
              className="mt-[5%] max-w-[92%] text-[4.7cqw] leading-[1.5]"
              style={{ color: theme.muted }}
            >
              {slide.subtext}
            </p>
          )}

          <div
            className="mt-auto flex flex-col items-center gap-[0.8cqw] pb-[2%] text-[3.3cqw]"
            style={{ color: theme.muted }}
          >
            <span>아래로 스크롤</span>
            <ChevronDown
              className="size-[6.4cqw] animate-bounce"
              style={{ color: theme.accent }}
            />
          </div>
        </div>
      ) : null}

      {slide.type === "BODY" ? (
        <div
          className={cn(
            "relative z-[2] mt-[3%] mb-[7%] flex min-h-0 flex-1 flex-col justify-between",
            panel,
          )}
          style={{ background: theme.surface }}
        >
          <div className="shrink-0">
            {edit ? (
              <EditableText
                value={slide.headline}
                multiline
                onChange={(v) => setField("headline", v)}
                className="text-[6.8cqw] font-bold leading-[1.28] tracking-tight"
              />
            ) : (
              <h2 className="text-[6.8cqw] font-bold leading-[1.28] tracking-tight">
                {slide.headline}
              </h2>
            )}
            {edit ? (
              <EditableText
                value={slide.subtext}
                onChange={(v) => setField("subtext", v)}
                className="mt-[2.5%] text-[4.4cqw] font-medium leading-snug"
                style={{ color: theme.accent }}
              />
            ) : (
              <p
                className="mt-[2.5%] text-[4.4cqw] font-medium leading-snug"
                style={{ color: theme.accent }}
              >
                {slide.subtext}
              </p>
            )}
          </div>

          <ul className="mt-[6%] flex min-h-0 flex-1 flex-col justify-evenly gap-[3.5cqw] py-[2%]">
            {slide.bodyBullets.map((b, i) => (
              <li
                key={`${slide.slideNumber}-b-${i}`}
                className="flex items-start gap-[2.5%]"
              >
                <span
                  className="mt-[1.6cqw] size-[2.4cqw] shrink-0 rounded-full"
                  style={{ background: theme.accent }}
                  aria-hidden
                />
                {edit ? (
                  <EditableText
                    value={b}
                    multiline
                    onChange={(v) => setBullet(i, v)}
                    className="flex-1 text-[5.2cqw] leading-[1.4]"
                  />
                ) : (
                  <span className="flex-1 text-[5.2cqw] leading-[1.4]">{b}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {slide.type === "CTA" ? (
        <div
          className={cn(
            "relative z-[2] mt-[4%] mb-[7%] flex min-h-0 flex-1 flex-col items-center justify-evenly py-[4%] text-center",
            panel,
          )}
          style={{ background: theme.surface }}
        >
          {edit ? (
            <EditableText
              value={slide.headline}
              multiline
              onChange={(v) => setField("headline", v)}
              className="max-w-[92%] text-[7.6cqw] font-bold leading-[1.3] tracking-tight"
            />
          ) : (
            <h2 className="max-w-[92%] text-[7.6cqw] font-bold leading-[1.3] tracking-tight">
              {slide.headline}
            </h2>
          )}
          {edit ? (
            <EditableText
              value={slide.subtext}
              multiline
              onChange={(v) => setField("subtext", v)}
              className="max-w-[88%] text-[4.5cqw] leading-[1.45]"
              style={{ color: theme.muted }}
            />
          ) : (
            <p
              className="max-w-[88%] text-[4.5cqw] leading-[1.45]"
              style={{ color: theme.muted }}
            >
              {slide.subtext}
            </p>
          )}

          <div
            className="grid w-full max-w-[88%] grid-cols-3 items-start"
            style={{ color: theme.accent }}
          >
            {(
              [
                { Icon: Bookmark, label: "저장" },
                { Icon: Heart, label: "좋아요" },
                { Icon: UserPlus, label: "팔로우" },
              ] as const
            ).map(({ Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-start"
              >
                <span className="flex h-[8cqw] w-[8cqw] shrink-0 items-center justify-center">
                  <Icon className="h-[8cqw] w-[8cqw]" strokeWidth={1.75} />
                </span>
                <span className="mt-[1.6cqw] text-[3.1cqw] font-medium leading-none">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div
        className="pointer-events-none absolute bottom-[3.2%] left-[8%] z-[2] text-[2.2cqw] tracking-wide"
        style={{ color: theme.muted }}
      >
        CardVibe AI · 1080×1350
      </div>
    </article>
  );
}
