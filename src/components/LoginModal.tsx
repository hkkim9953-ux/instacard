"use client";

import { useState, type FormEvent } from "react";
import {
  GoogleAuthProvider,
  sendSignInLinkToEmail,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { Loader2, Mail, X } from "lucide-react";
import { ADMIN_EMAIL, isAdminEmail } from "@/lib/admin";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { cn } from "@/lib/utils";

function authErrorMessage(e: unknown, fallback: string) {
  const raw = e instanceof Error ? e.message : fallback;
  if (raw.includes("operation-not-allowed")) {
    return "이메일/Google 로그인이 Firebase에서 아직 꺼져 있습니다. Console → Authentication → Sign-in method에서 Email link와 Google을 켜 주세요.";
  }
  if (raw.includes("unauthorized-domain")) {
    return "이 도메인이 Firebase 승인 도메인에 없습니다. Console → Authentication → Settings → Authorized domains에 localhost를 추가하세요.";
  }
  if (raw.includes("popup-closed-by-user")) {
    return "로그인 창이 닫혔습니다. 다시 시도해 주세요.";
  }
  return raw;
}

type Props = {
  open: boolean;
  onClose: () => void;
  adminOnly?: boolean;
  onDenied?: () => void;
};

export function LoginModal({ open, onClose, adminOnly, onDenied }: Props) {
  const [email, setEmail] = useState(adminOnly ? ADMIN_EMAIL : "");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  if (!open) return null;

  async function ensureAdminOrKick() {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;
    if (!adminOnly) return true;
    if (user && isAdminEmail(user.email)) return true;
    onDenied?.();
    try {
      await signOut(auth);
    } catch {
      /* ignore */
    }
    setMsg("관리자 계정(hkkim9953@gmail.com)만 로그인할 수 있습니다.");
    return false;
  }

  async function googleLogin() {
    setBusy(true);
    setMsg(null);
    try {
      const auth = getFirebaseAuth();
      await signInWithPopup(auth, new GoogleAuthProvider());
      if (!(await ensureAdminOrKick())) return;
      onClose();
    } catch (e) {
      setMsg(authErrorMessage(e, "Google 로그인 실패 — Firebase 설정을 확인하세요."));
    } finally {
      setBusy(false);
    }
  }

  async function magicLink(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const target = email.trim();
      if (adminOnly && !isAdminEmail(target)) {
        setMsg("관리자 이메일만 매직 링크를 받을 수 있습니다.");
        return;
      }
      const auth = getFirebaseAuth();
      const actionCodeSettings = {
        url: `${window.location.origin}/auth/callback`,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, target, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", target);
      setSent(true);
    } catch (err) {
      setMsg(authErrorMessage(err, "메일 전송 실패"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 id="login-title" className="text-lg font-semibold">
              {adminOnly ? "관리자 로그인" : "로그인"}
            </h2>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {adminOnly
                ? "허용된 Google 계정으로만 이용할 수 있습니다."
                : "Firebase Auth · 프로젝트를 저장하려면 로그인해 주세요."}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1 text-[var(--muted)] hover:bg-black/5"
            aria-label="닫기"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 space-y-2">
          <button
            type="button"
            disabled={busy}
            onClick={googleLogin}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-xl border border-black/10",
              "bg-white px-4 py-2.5 text-sm font-medium hover:bg-[var(--bg)] disabled:opacity-50",
            )}
          >
            Google로 계속
          </button>
        </div>

        <div className="my-4 flex items-center gap-3 text-xs text-[var(--muted)]">
          <span className="h-px flex-1 bg-black/10" />
          또는 이메일
          <span className="h-px flex-1 bg-black/10" />
        </div>

        {sent ? (
          <p className="rounded-xl bg-[var(--bg)] px-3 py-3 text-sm text-[var(--ink)]">
            매직 링크를 <strong>{email}</strong> 로 보냈습니다. 메일함 링크를
            눌러 로그인하세요.
          </p>
        ) : (
          <form onSubmit={magicLink} className="space-y-2">
            <label className="block">
              <span className="sr-only">이메일</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={adminOnly ? ADMIN_EMAIL : "you@example.com"}
                readOnly={adminOnly}
                className="w-full rounded-xl border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-black/30 read-only:bg-[var(--bg)]"
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className={cn(
                "flex w-full items-center justify-center gap-2 rounded-xl",
                "bg-[var(--accent)] px-4 py-2.5 text-sm font-medium text-white",
                "disabled:opacity-50",
              )}
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
              매직 링크 받기
            </button>
          </form>
        )}

        {msg ? (
          <p className="mt-3 text-sm text-red-600" role="alert">
            {msg}
          </p>
        ) : null}
      </div>
    </div>
  );
}
