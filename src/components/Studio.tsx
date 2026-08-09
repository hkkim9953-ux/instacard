"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Download, Loader2, Save, Wand2 } from "lucide-react";
import { generateSlidesLocal } from "@/lib/card";
import {
  toCardSlides,
  type GenerateResult,
} from "@/lib/generateSchema";
import {
  getProjectClient,
  saveProjectClient,
} from "@/lib/firebase/projects";
import { cn } from "@/lib/utils";
import {
  CARD_THEMES,
  CardSlide,
  type CardSlideData,
  type CardThemeId,
} from "@/components/CardSlide";
import { LoginModal } from "@/components/LoginModal";

const SAMPLE = `개발자가 퍼스널 브랜딩을 시작해야 하는 이유

1. 채용 시장에서 검색되는 사람이 된다
2. 사이드 프로젝트 홍보가 쉬워진다
3. 네트워크가 콘텐츠로 쌓인다

오늘은 주 1회 카드뉴스 루틴만 잡아보세요.`;

export function Studio() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectParam = searchParams.get("project");

  const [raw, setRaw] = useState(SAMPLE);
  const [themeId, setThemeId] = useState<CardThemeId>("minimal-light");
  const [slides, setSlides] = useState<CardSlideData[]>([]);
  const [bgImage, setBgImage] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [generating, setGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [genStep, setGenStep] = useState("");
  const [exporting, setExporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingProject, setLoadingProject] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const theme = useMemo(
    () => CARD_THEMES.find((t) => t.id === themeId) ?? CARD_THEMES[1]!,
    [themeId],
  );

  useEffect(() => {
    if (!generating) {
      setGenProgress(0);
      setGenStep("");
      return;
    }

    const steps: { at: number; label: string }[] = [
      { at: 8, label: "원문 분석 중…" },
      { at: 28, label: "슬라이드 구조 잡는 중…" },
      { at: 52, label: "카피 작성 중…" },
      { at: 72, label: "배경 이미지 생성 중…" },
      { at: 88, label: "마무리 중…" },
    ];

    setGenProgress(5);
    setGenStep(steps[0]!.label);

    let p = 5;
    const id = window.setInterval(() => {
      p = Math.min(p + (p < 60 ? 3 : p < 80 ? 1.5 : 0.4), 92);
      setGenProgress(p);
      const cur = [...steps].reverse().find((s) => p >= s.at);
      if (cur) setGenStep(cur.label);
    }, 400);

    return () => window.clearInterval(id);
  }, [generating]);

  useEffect(() => {
    if (!projectParam) return;
    let cancelled = false;
    (async () => {
      setLoadingProject(true);
      setMsg(null);
      try {
        const p = await getProjectClient(projectParam);
        if (cancelled) return;
        if (!p) {
          setMsg("프로젝트를 찾을 수 없습니다.");
          return;
        }
        setProjectId(p.id);
        setProjectTitle(p.title);
        setThemeId((p.themeId as CardThemeId) || "minimal-light");
        setSlides(Array.isArray(p.slides) ? p.slides : []);
        const savedBg = p.themeConfig?.bgImage;
        setBgImage(typeof savedBg === "string" ? savedBg : null);
        setCaption(p.captionText ?? "");
        setHashtags(p.hashtags ?? []);
        setRaw(p.sourceText ?? "");
        setInfo(`불러옴 · ${p.title}`);
      } catch (e) {
        if (cancelled) return;
        const message = e instanceof Error ? e.message : "불러오기 실패";
        if (message.includes("로그인")) {
          setLoginOpen(true);
          setMsg("프로젝트를 보려면 로그인해 주세요.");
        } else {
          setMsg(message);
        }
      } finally {
        if (!cancelled) setLoadingProject(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [projectParam]);

  function patchSlide(index: number, patch: Partial<CardSlideData>) {
    setSlides((prev) =>
      prev.map((s, i) => (i === index ? { ...s, ...patch } : s)),
    );
  }

  async function onSave() {
    setMsg(null);
    if (!slides.length) {
      setMsg("저장할 슬라이드가 없습니다.");
      return;
    }
    setSaving(true);
    try {
      const title =
        projectTitle.trim() ||
        slides.find((s) => s.type === "COVER")?.headline ||
        "제목 없는 카드뉴스";

      const saved = await saveProjectClient({
        id: projectId ?? undefined,
        title,
        themeId,
        slides,
        caption,
        hashtags,
        sourceText: raw,
        bgImage,
      });
      setProjectId(saved.id);
      setProjectTitle(title);
      setInfo(`저장 완료 · ${title}`);
      router.replace(`/?project=${saved.id}`);
    } catch (e) {
      const message = e instanceof Error ? e.message : "저장 실패";
      if (message.includes("로그인")) {
        setLoginOpen(true);
        setMsg("저장하려면 로그인해 주세요.");
      } else {
        setMsg(message);
      }
    } finally {
      setSaving(false);
    }
  }

  async function onGenerate() {
    setMsg(null);
    setInfo(null);
    if (!raw.trim()) {
      setMsg("원문을 입력해 주세요.");
      return;
    }

    setGenerating(true);
    setGenProgress(5);
    setGenStep("원문 분석 중…");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: raw }),
      });
      const data = (await res.json()) as GenerateResult & { error?: string };

      setGenProgress(100);
      setGenStep("완료");

      if (!res.ok) {
        const local = generateSlidesLocal(raw);
        setSlides(local);
        setBgImage(null);
        setCaption(
          [local[0]?.headline ?? "카드뉴스", "", "저장해두고 다시 보세요 ✨"].join(
            "\n",
          ),
        );
        setHashtags(["#카드뉴스", "#CardVibe"]);
        setInfo(
          data.error
            ? `AI 생성 실패 → 로컬 초안 사용 (${data.error})`
            : "AI 생성 실패 → 로컬 초안 사용",
        );
        return;
      }

      setSlides(toCardSlides(data));
      setBgImage(data.bgImage || null);
      setCaption(data.caption);
      setHashtags(data.hashtags ?? []);
      setInfo(
        data.title
          ? `생성 완료 · ${data.title}${data.bgImage ? " · 배경 적용" : ""}`
          : "생성 완료",
      );
    } catch (e) {
      setGenProgress(100);
      setGenStep("완료");
      const local = generateSlidesLocal(raw);
      setSlides(local);
      setBgImage(null);
      setCaption(local[0]?.headline ?? "");
      setHashtags(["#카드뉴스", "#CardVibe"]);
      setInfo(
        e instanceof Error
          ? `네트워크 오류 → 로컬 초안 사용 (${e.message})`
          : "네트워크 오류 → 로컬 초안 사용",
      );
    } finally {
      window.setTimeout(() => {
        setGenerating(false);
        setGenProgress(0);
        setGenStep("");
      }, 350);
    }
  }

  async function onDownload() {
    if (!slides.length || !previewRef.current) return;
    setExporting(true);
    setMsg(null);
    try {
      const { toPng } = await import("html-to-image");
      const JSZip = (await import("jszip")).default;
      const { saveAs } = await import("file-saver");

      const nodes = previewRef.current.querySelectorAll<HTMLElement>(
        "[data-slide-card]",
      );
      const zip = new JSZip();

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]!;
        const dataUrl = await toPng(node, {
          cacheBust: true,
          pixelRatio: 1080 / Math.max(node.offsetWidth, 1),
          backgroundColor: theme.bg,
        });
        const res = await fetch(dataUrl);
        const blob = await res.blob();
        zip.file(`card-${String(i + 1).padStart(2, "0")}.png`, blob);
      }

      const out = await zip.generateAsync({ type: "blob" });
      saveAs(out, "cardvibe-slides.zip");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "다운로드 실패");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-8">
      <section className="mx-auto max-w-2xl text-center">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          텍스트로 인스타 카드뉴스 만들기
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
          블로그·노션·아이디어를 넣으면 AI가 4:5(1080×1350) 슬라이드로 나눠
          줍니다. 미리보기 문구는 클릭해서 바로 수정할 수 있습니다.
        </p>

        <div className="mt-6 text-left">
          <label className="block">
            <span className="sr-only">원문 입력</span>
            <textarea
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              rows={8}
              disabled={generating}
              className={cn(
                "w-full resize-y rounded-2xl border border-black/10 bg-white",
                "px-4 py-3 text-sm leading-relaxed outline-none",
                "focus:border-black/30 disabled:opacity-60",
              )}
              placeholder="블로그 글, 노션 메모, 키워드를 붙여넣으세요"
            />
          </label>

          {(generating || genProgress > 0) ? (
            <div className="mt-3 space-y-1.5" aria-live="polite">
              <div className="flex items-center justify-between gap-2 text-xs text-[var(--muted)]">
                <span>{genStep || "준비 중…"}</span>
                <span className="tabular-nums">{Math.round(genProgress)}%</span>
              </div>
              <div
                className="h-2 overflow-hidden rounded-full bg-black/10"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(genProgress)}
                aria-label="카드뉴스 생성 진행률"
              >
                <div
                  className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-300 ease-out"
                  style={{ width: `${genProgress}%` }}
                />
              </div>
            </div>
          ) : null}

          <button
            type="button"
            onClick={onGenerate}
            disabled={generating}
            className={cn(
              "mt-3 flex w-full items-center justify-center gap-2 rounded-xl",
              "bg-[var(--accent)] px-4 py-3 text-sm font-medium text-white",
              "transition hover:opacity-90 disabled:opacity-60",
            )}
          >
            {generating ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Wand2 className="h-4 w-4" aria-hidden />
            )}
            {generating ? "AI 생성 중…" : "카드뉴스 생성하기"}
          </button>

          {msg ? (
            <p className="mt-2 text-sm text-red-600" role="alert">
              {msg}
            </p>
          ) : null}
          {info ? (
            <p className="mt-2 text-sm text-[var(--muted)]">{info}</p>
          ) : null}
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-2">
        <aside className="space-y-5 rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <div>
            <h2 className="text-sm font-semibold">편집</h2>
            <p className="mt-1 text-xs text-[var(--muted)]">
              템플릿 선택 후, 미리보기 텍스트를 클릭해 수정하세요.
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-[var(--muted)]">템플릿</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {CARD_THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setThemeId(t.id)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-xs font-medium transition",
                    themeId === t.id
                      ? "border-black bg-black text-white"
                      : "border-black/10 bg-[var(--bg)] text-[var(--ink)] hover:border-black/25",
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onDownload}
            disabled={!slides.length || exporting || generating || loadingProject}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl border border-black/10",
              "bg-[var(--bg)] px-4 py-2.5 text-sm font-medium",
              "disabled:opacity-40",
            )}
          >
            {exporting ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Download className="h-4 w-4" aria-hidden />
            )}
            {exporting ? "렌더링 중…" : "PNG ZIP 다운로드"}
          </button>

          <button
            type="button"
            onClick={onSave}
            disabled={!slides.length || saving || generating || loadingProject}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl",
              "bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white",
              "disabled:opacity-40",
            )}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Save className="h-4 w-4" aria-hidden />
            )}
            {saving ? "저장 중…" : projectId ? "프로젝트 업데이트" : "프로젝트 저장"}
          </button>

          {slides.length > 0 ? (
            <div className="rounded-xl border border-black/5 bg-[var(--bg)] p-3">
              <p className="text-xs font-medium text-[var(--muted)]">
                캡션 · 해시태그
              </p>
              <pre className="mt-2 max-h-48 overflow-y-auto whitespace-pre-wrap text-xs leading-relaxed">
                {caption}
                {hashtags.length ? `\n\n${hashtags.join(" ")}` : ""}
              </pre>
            </div>
          ) : (
            <p className="text-xs text-[var(--muted)]">
              카드를 생성하면 편집·다운로드 영역이 활성화됩니다.
            </p>
          )}
        </aside>

        <div>
          <div className="mb-3 flex items-end justify-between">
            <h2 className="text-sm font-semibold">미리보기</h2>
            <p className="text-xs text-[var(--muted)]">
              {slides.length
                ? `${slides.length}장 · 피드 4:5`
                : "생성 후 슬라이드 표시"}
            </p>
          </div>

          <div
            ref={previewRef}
            className="grid max-h-[70vh] gap-4 overflow-y-auto sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2"
          >
            {slides.length === 0 ? (
              <div className="col-span-full flex aspect-[4/5] max-w-sm items-center justify-center rounded-2xl border border-dashed border-black/15 bg-white/60 text-sm text-[var(--muted)]">
                {generating
                  ? "AI가 원고·배경 이미지를 만드는 중…"
                  : "카드뉴스 미리보기 영역"}
              </div>
            ) : (
              slides.map((s, i) => (
                <CardSlide
                  key={`${s.slideNumber}-${s.type}-${i}`}
                  slide={s}
                  theme={themeId}
                  total={slides.length}
                  bgImage={bgImage}
                  onChange={(patch) => patchSlide(i, patch)}
                />
              ))
            )}
          </div>
        </div>
      </section>
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </div>
  );
}
