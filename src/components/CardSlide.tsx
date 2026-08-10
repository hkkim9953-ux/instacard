"use client";

import type { CSSProperties, ReactNode } from "react";
import { Bookmark, ChevronDown, Heart, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

export type CardSlideType = "COVER" | "BODY" | "CTA";
export type CardThemeId =
  | "tech-dark"
  | "minimal-light"
  | "bold-brand"
  | "soft-lavender"
  | "forest-calm"
  | "midnight-neon"
  | "ocean-breeze"
  | "charcoal-ink"
  | "peach-blush"
  | "slate-pro";

export type AtmosphereId =
  | "grid-dark"
  | "cream-soft"
  | "warm-bold"
  | "lavender-mist"
  | "forest-haze"
  | "neon-glow"
  | "ocean-wash"
  | "ink-lines"
  | "peach-glow"
  | "slate-mesh";

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
  atmosphere: AtmosphereId;
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
  /** bgImage 위 오버레이 */
  imageOverlay: string;
  /** COVER 하단 장식 그라데이션 */
  coverAccent: string;
};

export const CARD_THEMES: ThemeTokens[] = [
  {
    id: "tech-dark",
    label: "Tech Dark",
    atmosphere: "grid-dark",
    bg: "#0B1220",
    fg: "#F8FAFC",
    muted: "#94A3B8",
    accent: "#38BDF8",
    badgeBg: "rgba(56,189,248,0.18)",
    badgeFg: "#7DD3FC",
    surface: "rgba(15,23,42,0.55)",
    canvas:
      "radial-gradient(120% 80% at 10% -10%, #1e3a5f 0%, transparent 55%), radial-gradient(90% 70% at 100% 20%, #0ea5e940 0%, transparent 50%), linear-gradient(165deg, #0B1220 0%, #111827 45%, #0f172a 100%)",
    imageOverlay:
      "linear-gradient(180deg, rgba(11,18,32,0.55) 0%, rgba(15,23,42,0.48) 40%, rgba(11,18,32,0.72) 100%)",
    coverAccent: "linear-gradient(135deg, #0ea5e9aa, #1e293b 55%, #334155)",
  },
  {
    id: "minimal-light",
    label: "Minimal Light",
    atmosphere: "cream-soft",
    bg: "#F3EEE6",
    fg: "#1C1917",
    muted: "#78716C",
    accent: "#1C1917",
    badgeBg: "rgba(28,25,23,0.07)",
    badgeFg: "#44403C",
    surface: "rgba(255,255,255,0.72)",
    canvas:
      "radial-gradient(100% 70% at 0% 0%, #fff 0%, transparent 55%), radial-gradient(80% 60% at 100% 10%, #e7d5c4 0%, transparent 50%), linear-gradient(180deg, #F7F3EC 0%, #EFE8DE 55%, #E8DFD3 100%)",
    imageOverlay:
      "linear-gradient(180deg, rgba(247,243,236,0.58) 0%, rgba(239,232,222,0.48) 45%, rgba(232,223,211,0.7) 100%)",
    coverAccent: "linear-gradient(135deg, #d6c2ae, #b8a090 45%, #9a8574)",
  },
  {
    id: "bold-brand",
    label: "Bold Brand",
    atmosphere: "warm-bold",
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
    imageOverlay:
      "linear-gradient(180deg, rgba(255,247,237,0.55) 0%, rgba(255,237,213,0.45) 45%, rgba(254,215,170,0.68) 100%)",
    coverAccent: "linear-gradient(135deg, #ea580c, #fb923c 50%, #fdba74)",
  },
  {
    id: "soft-lavender",
    label: "Soft Lavender",
    atmosphere: "lavender-mist",
    bg: "#F5F3FF",
    fg: "#2E1065",
    muted: "#7C6FA0",
    accent: "#7C3AED",
    badgeBg: "rgba(124,58,237,0.12)",
    badgeFg: "#6D28D9",
    surface: "rgba(255,255,255,0.78)",
    canvas:
      "radial-gradient(90% 70% at 100% 0%, #ddd6fe 0%, transparent 55%), radial-gradient(80% 60% at 0% 100%, #c4b5fd55 0%, transparent 50%), linear-gradient(165deg, #FAF5FF 0%, #F3E8FF 50%, #EDE9FE 100%)",
    imageOverlay:
      "linear-gradient(180deg, rgba(250,245,255,0.55) 0%, rgba(237,233,254,0.45) 45%, rgba(221,214,254,0.7) 100%)",
    coverAccent: "linear-gradient(135deg, #a78bfa, #8b5cf6 50%, #7c3aed)",
  },
  {
    id: "forest-calm",
    label: "Forest Calm",
    atmosphere: "forest-haze",
    bg: "#ECFDF5",
    fg: "#14532D",
    muted: "#4D7C5E",
    accent: "#059669",
    badgeBg: "rgba(5,150,105,0.14)",
    badgeFg: "#047857",
    surface: "rgba(255,255,255,0.75)",
    canvas:
      "radial-gradient(100% 70% at 0% 0%, #d1fae5 0%, transparent 55%), radial-gradient(80% 55% at 100% 80%, #a7f3d050 0%, transparent 50%), linear-gradient(170deg, #F0FDF4 0%, #DCFCE7 45%, #BBF7D0 100%)",
    imageOverlay:
      "linear-gradient(180deg, rgba(240,253,244,0.55) 0%, rgba(220,252,231,0.45) 45%, rgba(187,247,208,0.7) 100%)",
    coverAccent: "linear-gradient(135deg, #34d399, #10b981 50%, #059669)",
  },
  {
    id: "midnight-neon",
    label: "Midnight Neon",
    atmosphere: "neon-glow",
    bg: "#0F0A1A",
    fg: "#F5F3FF",
    muted: "#A5B4FC",
    accent: "#F472B6",
    badgeBg: "rgba(244,114,182,0.18)",
    badgeFg: "#F9A8D4",
    surface: "rgba(30,15,50,0.6)",
    canvas:
      "radial-gradient(100% 70% at 90% 0%, #db277780 0%, transparent 50%), radial-gradient(80% 60% at 0% 80%, #6366f160 0%, transparent 50%), linear-gradient(165deg, #0F0A1A 0%, #1E1035 50%, #0B1026 100%)",
    imageOverlay:
      "linear-gradient(180deg, rgba(15,10,26,0.6) 0%, rgba(30,16,53,0.5) 40%, rgba(11,16,38,0.75) 100%)",
    coverAccent: "linear-gradient(135deg, #ec4899, #8b5cf6 55%, #6366f1)",
  },
  {
    id: "ocean-breeze",
    label: "Ocean Breeze",
    atmosphere: "ocean-wash",
    bg: "#ECFEFF",
    fg: "#0E4A5C",
    muted: "#5B8A99",
    accent: "#0891B2",
    badgeBg: "rgba(8,145,178,0.12)",
    badgeFg: "#0E7490",
    surface: "rgba(255,255,255,0.78)",
    canvas:
      "radial-gradient(95% 65% at 100% 0%, #a5f3fc 0%, transparent 55%), radial-gradient(75% 55% at 0% 100%, #67e8f955 0%, transparent 50%), linear-gradient(170deg, #F0FDFA 0%, #CCFBF1 40%, #A5F3FC 100%)",
    imageOverlay:
      "linear-gradient(180deg, rgba(240,253,250,0.55) 0%, rgba(204,251,241,0.45) 45%, rgba(165,243,252,0.7) 100%)",
    coverAccent: "linear-gradient(135deg, #22d3ee, #06b6d4 50%, #0891b2)",
  },
  {
    id: "charcoal-ink",
    label: "Charcoal Ink",
    atmosphere: "ink-lines",
    bg: "#18181B",
    fg: "#FAFAFA",
    muted: "#A1A1AA",
    accent: "#F4F4F5",
    badgeBg: "rgba(255,255,255,0.1)",
    badgeFg: "#E4E4E7",
    surface: "rgba(39,39,42,0.72)",
    headerBand: "#FAFAFA",
    canvas:
      "radial-gradient(90% 60% at 0% 0%, #3f3f4680 0%, transparent 50%), linear-gradient(160deg, #09090B 0%, #18181B 45%, #27272A 100%)",
    imageOverlay:
      "linear-gradient(180deg, rgba(9,9,11,0.55) 0%, rgba(24,24,27,0.5) 40%, rgba(39,39,42,0.75) 100%)",
    coverAccent: "linear-gradient(135deg, #52525b, #3f3f46 50%, #27272a)",
  },
  {
    id: "peach-blush",
    label: "Peach Blush",
    atmosphere: "peach-glow",
    bg: "#FFF1F2",
    fg: "#881337",
    muted: "#9F6B7A",
    accent: "#E11D48",
    badgeBg: "rgba(225,29,72,0.12)",
    badgeFg: "#BE123C",
    surface: "rgba(255,255,255,0.8)",
    canvas:
      "radial-gradient(90% 65% at 100% 0%, #fecdd3 0%, transparent 55%), radial-gradient(75% 55% at 0% 100%, #fda4af50 0%, transparent 50%), linear-gradient(165deg, #FFF1F2 0%, #FFE4E6 45%, #FECDD3 100%)",
    imageOverlay:
      "linear-gradient(180deg, rgba(255,241,242,0.55) 0%, rgba(255,228,230,0.45) 45%, rgba(254,205,211,0.7) 100%)",
    coverAccent: "linear-gradient(135deg, #fb7185, #f43f5e 50%, #e11d48)",
  },
  {
    id: "slate-pro",
    label: "Slate Pro",
    atmosphere: "slate-mesh",
    bg: "#F1F5F9",
    fg: "#0F172A",
    muted: "#64748B",
    accent: "#2563EB",
    badgeBg: "rgba(37,99,235,0.12)",
    badgeFg: "#1D4ED8",
    surface: "rgba(255,255,255,0.82)",
    canvas:
      "radial-gradient(95% 65% at 0% 0%, #e2e8f0 0%, transparent 55%), radial-gradient(80% 55% at 100% 100%, #bfdbfe55 0%, transparent 50%), linear-gradient(170deg, #F8FAFC 0%, #F1F5F9 50%, #E2E8F0 100%)",
    imageOverlay:
      "linear-gradient(180deg, rgba(248,250,252,0.55) 0%, rgba(241,245,249,0.45) 45%, rgba(226,232,240,0.7) 100%)",
    coverAccent: "linear-gradient(135deg, #60a5fa, #3b82f6 50%, #2563eb)",
  },
];

/** 내보내기·미리보기용 장식 배경 (외부 이미지 없이 CORS 안전) */
function CardAtmosphere({
  atmosphere,
  soft,
}: {
  atmosphere: AtmosphereId;
  soft?: boolean;
}) {
  const dim = soft ? "opacity-40" : "";
  const wrap = (children: ReactNode) => (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        dim,
      )}
      aria-hidden
    >
      {children}
      <Grain />
    </div>
  );

  if (atmosphere === "grid-dark") {
    return wrap(
      <>
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
      </>,
    );
  }

  if (atmosphere === "warm-bold") {
    return wrap(
      <>
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
      </>,
    );
  }

  if (atmosphere === "lavender-mist") {
    return wrap(
      <>
        <div className="absolute -right-[15%] -top-[10%] h-[48%] w-[60%] rounded-full bg-violet-300/40 blur-[36px]" />
        <div className="absolute -left-[18%] bottom-[-12%] h-[42%] w-[55%] rounded-full bg-fuchsia-200/35 blur-[40px]" />
        <div className="absolute bottom-[14%] right-[8%] h-[32%] w-[40%] rotate-[-6deg] rounded-[1.75rem] bg-gradient-to-br from-violet-400/25 to-transparent" />
        <div className="absolute left-[10%] top-[40%] h-[14%] w-[30%] rotate-3 rounded-2xl bg-white/55 shadow-sm" />
      </>,
    );
  }

  if (atmosphere === "forest-haze") {
    return wrap(
      <>
        <div className="absolute -right-[12%] -top-[8%] h-[46%] w-[55%] rounded-full bg-emerald-300/35 blur-[34px]" />
        <div className="absolute -left-[16%] bottom-[-10%] h-[44%] w-[58%] rounded-full bg-teal-200/40 blur-[38px]" />
        <div className="absolute bottom-[12%] right-[6%] h-[34%] w-[42%] rounded-[1.75rem] bg-gradient-to-br from-emerald-500/20 to-lime-200/10" />
        <div className="absolute left-[8%] top-[38%] h-[16%] w-[28%] -rotate-2 rounded-3xl border border-emerald-700/10 bg-white/45" />
      </>,
    );
  }

  if (atmosphere === "neon-glow") {
    return wrap(
      <>
        <div className="absolute -right-[20%] -top-[5%] h-[50%] w-[65%] rounded-full bg-fuchsia-500/30 blur-[42px]" />
        <div className="absolute -left-[18%] bottom-[-8%] h-[48%] w-[60%] rounded-full bg-indigo-500/35 blur-[46px]" />
        <div className="absolute bottom-[16%] right-[10%] h-[26%] w-[36%] rounded-[28%] border border-pink-300/30 bg-gradient-to-br from-pink-400/20 to-transparent" />
        <div
          className="absolute inset-0 opacity-[0.3]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(244,114,182,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(129,140,248,0.1) 1px, transparent 1px)",
            backgroundSize: "14% 11%",
          }}
        />
      </>,
    );
  }

  if (atmosphere === "ocean-wash") {
    return wrap(
      <>
        <div className="absolute -right-[14%] -top-[10%] h-[48%] w-[58%] rounded-full bg-cyan-300/40 blur-[36px]" />
        <div className="absolute -left-[18%] bottom-[-12%] h-[44%] w-[56%] rounded-full bg-teal-200/40 blur-[40px]" />
        <div className="absolute bottom-[12%] right-[8%] h-[34%] w-[44%] overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-cyan-400/30 to-sky-200/15">
          <div className="absolute inset-[12%] rounded-[1.2rem] border border-white/50 bg-white/20" />
        </div>
      </>,
    );
  }

  if (atmosphere === "ink-lines") {
    return wrap(
      <>
        <div
          className="absolute inset-0 opacity-[0.28]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "10% 8%",
          }}
        />
        <div className="absolute -right-[16%] top-[-6%] h-[42%] w-[50%] rounded-full bg-white/8 blur-[36px]" />
        <div className="absolute left-[8%] top-[40%] h-[18%] w-[26%] rotate-6 rounded-2xl border border-white/15 bg-white/5" />
        <div className="absolute bottom-[14%] right-[8%] h-[28%] w-[36%] rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/10 to-transparent" />
      </>,
    );
  }

  if (atmosphere === "peach-glow") {
    return wrap(
      <>
        <div className="absolute -right-[18%] -top-[8%] h-[50%] w-[62%] rounded-full bg-rose-300/40 blur-[36px]" />
        <div className="absolute -left-[16%] bottom-[-10%] h-[42%] w-[55%] rounded-full bg-pink-200/45 blur-[40px]" />
        <div className="absolute bottom-[14%] right-[8%] h-[34%] w-[42%] rotate-[-5deg] rounded-[1.75rem] bg-gradient-to-br from-rose-400/25 to-transparent" />
        <div className="absolute left-[10%] top-[40%] h-[14%] w-[28%] rotate-4 rounded-2xl bg-white/60 shadow-sm" />
      </>,
    );
  }

  if (atmosphere === "slate-mesh") {
    return wrap(
      <>
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(37,99,235,0.14) 1px, transparent 0)",
            backgroundSize: "4.2% 3.4%",
          }}
        />
        <div className="absolute -right-[12%] -top-[8%] h-[44%] w-[52%] rounded-full bg-blue-300/30 blur-[34px]" />
        <div className="absolute -left-[14%] bottom-[-10%] h-[40%] w-[50%] rounded-full bg-slate-300/40 blur-[36px]" />
        <div className="absolute bottom-[12%] right-[8%] h-[30%] w-[38%] rounded-[1.5rem] border border-slate-400/20 bg-white/50" />
      </>,
    );
  }

  // cream-soft (default / minimal)
  return wrap(
    <>
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
    </>,
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
            style={{ background: theme.imageOverlay }}
          />
        </div>
      ) : null}

      <CardAtmosphere atmosphere={theme.atmosphere} soft={Boolean(bgImage)} />

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
            style={{ background: theme.coverAccent }}
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
