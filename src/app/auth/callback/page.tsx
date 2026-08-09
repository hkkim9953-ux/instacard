"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
} from "firebase/auth";
import { Loader2 } from "lucide-react";
import { isAdminEmail } from "@/lib/admin";
import { getFirebaseAuth } from "@/lib/firebase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [msg, setMsg] = useState("로그인 처리 중…");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const auth = getFirebaseAuth();
        const href = window.location.href;

        if (isSignInWithEmailLink(auth, href)) {
          let email = window.localStorage.getItem("emailForSignIn");
          if (!email) {
            email =
              window.prompt("확인을 위해 이메일 주소를 다시 입력해 주세요.") ||
              "";
          }
          if (!email) {
            if (!cancelled) setMsg("이메일이 없어 로그인을 완료할 수 없습니다.");
            return;
          }
          await signInWithEmailLink(auth, email, href);
          window.localStorage.removeItem("emailForSignIn");
        }

        const user = auth.currentUser;
        if (!user || !isAdminEmail(user.email)) {
          try {
            await signOut(auth);
          } catch {
            /* ignore */
          }
          if (!cancelled) {
            setMsg("관리자 계정만 이용할 수 있습니다.");
            window.setTimeout(() => router.replace("/"), 1200);
          }
          return;
        }

        if (!cancelled) router.replace("/dashboard");
      } catch (e) {
        if (!cancelled) {
          setMsg(e instanceof Error ? e.message : "로그인 콜백 실패");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-3 px-5">
      <Loader2 className="h-5 w-5 animate-spin text-[var(--muted)]" />
      <p className="text-sm text-[var(--muted)]">{msg}</p>
    </main>
  );
}
