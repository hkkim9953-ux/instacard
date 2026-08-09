"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { LayoutGrid, LogOut, Sparkles } from "lucide-react";
import { isAdminEmail } from "@/lib/admin";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { cn } from "@/lib/utils";
import { LoginModal } from "@/components/LoginModal";

export function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    try {
      const auth = getFirebaseAuth();
      return onAuthStateChanged(auth, async (u) => {
        if (u && !isAdminEmail(u.email)) {
          try {
            await signOut(auth);
          } catch {
            /* ignore */
          }
          setUser(null);
          return;
        }
        setUser(u);
      });
    } catch {
      return;
    }
  }, []);

  async function logout() {
    try {
      await signOut(getFirebaseAuth());
      setUser(null);
    } catch {
      setUser(null);
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-black/5 bg-[var(--bg)]/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-5">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--accent)] text-white">
              <Sparkles className="h-4 w-4" aria-hidden />
            </span>
            <span className="text-sm font-semibold tracking-tight text-[var(--ink)]">
              CardVibe AI
            </span>
          </Link>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="hidden text-xs text-[var(--muted)] sm:inline">
                  {user.email}
                </span>
                <Link
                  href="/dashboard"
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white",
                    "px-3 py-1.5 text-sm font-medium hover:border-black/25",
                  )}
                >
                  <LayoutGrid className="h-3.5 w-3.5" />
                  내 프로젝트
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-white",
                    "px-3 py-1.5 text-sm font-medium hover:border-black/25",
                  )}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  로그아웃
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setLoginOpen(true)}
                className={cn(
                  "rounded-full border border-black/10 bg-white px-4 py-1.5",
                  "text-sm font-medium text-[var(--ink)] transition hover:border-black/25",
                )}
              >
                관리자 로그인
              </button>
            )}
          </div>
        </div>
      </header>

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        adminOnly
      />
    </>
  );
}
