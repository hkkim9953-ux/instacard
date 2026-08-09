import { Suspense } from "react";
import { AdminGate } from "@/components/AdminGate";
import { Header } from "@/components/Header";
import { Studio } from "@/components/Studio";

export default function Home() {
  return (
    <div className="min-h-dvh">
      <Header />
      <main>
        <AdminGate>
          <Suspense
            fallback={
              <p className="px-5 py-10 text-sm text-[var(--muted)]">
                불러오는 중…
              </p>
            }
          >
            <Studio />
          </Suspense>
        </AdminGate>
      </main>
    </div>
  );
}
