"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Download, Loader2, Pencil, Trash2 } from "lucide-react";
import {
  deleteProjectClient,
  deleteProjectsClient,
  getProjectSlideImages,
  listProjectsClient,
} from "@/lib/firebase/projects";
import type { ProjectDoc } from "@/lib/projects";
import { cn } from "@/lib/utils";

export function DashboardClient() {
  const [projects, setProjects] = useState<ProjectDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await listProjectsClient();
      setProjects(list);
      setSelected(new Set());
    } catch (e) {
      setError(e instanceof Error ? e.message : "불러오기 실패");
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((prev) =>
      prev.size === projects.length
        ? new Set()
        : new Set(projects.map((p) => p.id)),
    );
  }

  async function remove(id: string) {
    if (!confirm("이 프로젝트와 저장된 이미지를 삭제할까요?")) return;
    setBusy(true);
    try {
      await deleteProjectClient(id);
      void load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "삭제 실패");
    } finally {
      setBusy(false);
    }
  }

  async function removeSelected() {
    if (!selected.size) return;
    if (
      !confirm(
        `선택한 ${selected.size}개 프로젝트와 저장된 이미지를 삭제할까요?`,
      )
    ) {
      return;
    }
    setBusy(true);
    try {
      await deleteProjectsClient([...selected]);
      void load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "일괄 삭제 실패");
    } finally {
      setBusy(false);
    }
  }

  async function downloadImages(p: ProjectDoc) {
    if (!p.imageCount) {
      alert("저장된 이미지가 없습니다. 스튜디오에서 다시 저장해 주세요.");
      return;
    }
    setBusy(true);
    try {
      const images = await getProjectSlideImages(p.id);
      if (!images.length) {
        throw new Error("저장된 이미지가 없습니다.");
      }
      const JSZip = (await import("jszip")).default;
      const { saveAs } = await import("file-saver");
      const zip = new JSZip();
      for (let i = 0; i < images.length; i++) {
        const res = await fetch(images[i]!);
        zip.file(
          `card-${String(i + 1).padStart(2, "0")}.jpg`,
          await res.blob(),
        );
      }
      const out = await zip.generateAsync({ type: "blob" });
      const safe = p.title.replace(/[\\/:*?"<>|]/g, "_").slice(0, 40) || "card";
      saveAs(out, `${safe}.zip`);
    } catch (e) {
      alert(e instanceof Error ? e.message : "다운로드 실패");
    } finally {
      setBusy(false);
    }
  }

  const allSelected =
    projects.length > 0 && selected.size === projects.length;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">내 프로젝트</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            저장한 카드뉴스·이미지를 다시 열거나 삭제할 수 있습니다.
          </p>
        </div>
        <Link
          href="/"
          className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white"
        >
          새 카드뉴스
        </Link>
      </div>

      {loading ? (
        <p className="mt-10 flex items-center gap-2 text-sm text-[var(--muted)]">
          <Loader2 className="h-4 w-4 animate-spin" />
          불러오는 중…
        </p>
      ) : null}

      {error ? (
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          {error}
          {error.includes("로그인") ? (
            <p className="mt-1 text-xs">상단에서 로그인한 뒤 다시 열어 주세요.</p>
          ) : null}
        </div>
      ) : null}

      {!loading && !error && projects.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-black/15 bg-white px-6 py-12 text-center">
          <p className="text-sm text-[var(--muted)]">아직 저장된 프로젝트가 없습니다.</p>
          <Link href="/" className="mt-4 inline-block text-sm font-medium underline">
            첫 카드뉴스 만들기
          </Link>
        </div>
      ) : null}

      {!loading && projects.length > 0 ? (
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <label className="inline-flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
              className="size-4 accent-black"
            />
            전체 선택
          </label>
          <button
            type="button"
            disabled={!selected.size || busy}
            onClick={() => void removeSelected()}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border border-red-200",
              "px-3 py-1.5 text-xs font-medium text-red-700",
              "hover:bg-red-50 disabled:opacity-40",
            )}
          >
            {busy ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            선택 삭제 ({selected.size})
          </button>
        </div>
      ) : null}

      <ul className="mt-4 space-y-3">
        {projects.map((p) => {
          const count = Array.isArray(p.slides) ? p.slides.length : 0;
          const cover = p.coverThumb;
          const checked = selected.has(p.id);
          return (
            <li
              key={p.id}
              className="flex items-center gap-3 rounded-2xl border border-black/5 bg-white px-3 py-3 shadow-sm sm:px-4"
            >
              <input
                type="checkbox"
                checked={checked}
                onChange={() => toggle(p.id)}
                className="size-4 shrink-0 accent-black"
                aria-label={`${p.title} 선택`}
              />
              <div className="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg border border-black/10 bg-[var(--bg)]">
                {cover ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cover}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center text-[10px] text-[var(--muted)]">
                    없음
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{p.title}</p>
                <p className="mt-0.5 text-xs text-[var(--muted)]">
                  {count}장
                  {p.imageCount
                    ? ` · 이미지 ${p.imageCount}`
                    : " · 이미지 미저장"}{" "}
                  · {p.themeId} ·{" "}
                  {new Date(p.updatedAt).toLocaleString("ko-KR")}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5">
                {p.imageCount ? (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => void downloadImages(p)}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full border border-black/10",
                      "px-2.5 py-1.5 text-xs font-medium hover:bg-[var(--bg)]",
                      "disabled:opacity-40",
                    )}
                  >
                    <Download className="h-3.5 w-3.5" />
                    ZIP
                  </button>
                ) : null}
                <Link
                  href={`/?project=${p.id}`}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border border-black/10",
                    "px-2.5 py-1.5 text-xs font-medium hover:bg-[var(--bg)]",
                  )}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  편집
                </Link>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => void remove(p.id)}
                  className="inline-flex items-center gap-1 rounded-full border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50 disabled:opacity-40"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  삭제
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
