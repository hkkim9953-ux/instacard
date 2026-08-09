"use client";

import { useEffect, useState, type ReactNode } from "react";
import { onAuthStateChanged, signOut, type User } from "firebase/auth";
import { Loader2 } from "lucide-react";
import { isAdminEmail } from "@/lib/admin";
import { getFirebaseAuth } from "@/lib/firebase/client";
import { LoginModal } from "@/components/LoginModal";

type Props = { children: ReactNode };

export function AdminGate({ children }: Props) {
  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    try {
      const auth = getFirebaseAuth();
      return onAuthStateChanged(auth, async (u) => {
        if (u && !isAdminEmail(u.email)) {
          setDenied(true);
          try {
            await signOut(auth);
          } catch {
            /* ignore */
          }
          setUser(null);
        } else {
          if (u) setDenied(false);
          setUser(u);
        }
        setReady(true);
      });
    } catch {
      setReady(true);
    }
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-2 text-sm text-[var(--muted)]">
        <Loader2 className="h-4 w-4 animate-spin" />
        확인 중…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[50vh] w-full max-w-md flex-col items-center justify-center px-5 text-center">
        <h1 className="text-xl font-semibold tracking-tight">관리자 전용</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          {denied
            ? "허용된 관리자 계정으로만 이용할 수 있습니다."
            : "CardVibe AI는 관리자 로그인 후 이용할 수 있습니다."}
        </p>
        <button
          type="button"
          onClick={() => setLoginOpen(true)}
          className="mt-6 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-medium text-white"
        >
          관리자 로그인
        </button>
        <LoginModal
          open={loginOpen}
          onClose={() => setLoginOpen(false)}
          adminOnly
          onDenied={() => setDenied(true)}
        />
      </div>
    );
  }

  return <>{children}</>;
}
