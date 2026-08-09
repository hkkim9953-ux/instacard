"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import {
  deleteProjectClient,
  listProjectsClient,
} from "@/lib/firebase/projects";
import type { ProjectDoc } from "@/lib/projects";
import { cn } from "@/lib/utils";

export function DashboardClient() {
  const [projects, setProjects] = useState<ProjectDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await listProjectsClient();
      setProjects(list);
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

  async function remove(id: string) {
    if (!confirm("이 프로젝트를 삭제할까요?")) return;
    try {
      await deleteProjectClient(id);
      void load();
    } catch (e) {
      alert(e instanceof Error ? e.message : "삭제 실패");
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-10">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">내 프로젝트</h1>
          <p className="mt-1 text-sm text-[var(--muted)]">
            저장한 카드뉴스를 다시 열어 편집할 수 있습니다.
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

      <ul className="mt-8 space-y-3">
        {projects.map((p) => {
          const count = Array.isArray(p.slides) ? p.slides.length : 0;
          return (
            <li
              key={p.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-black/5 bg-white px-4 py-3 shadow-sm"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{p.title}</p>
                <p className="mt-0.5 text-xs text-[var(--muted)]">
                  {count}장 · {p.themeId} ·{" "}
                  {new Date(p.updatedAt).toLocaleString("ko-KR")}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <Link
                  href={`/?project=${p.id}`}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-full border border-black/10",
                    "px-3 py-1.5 text-xs font-medium hover:bg-[var(--bg)]",
                  )}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  편집
                </Link>
                <button
                  type="button"
                  onClick={() => void remove(p.id)}
                  className="inline-flex items-center gap-1 rounded-full border border-red-200 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-50"
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
