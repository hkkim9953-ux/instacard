import { AdminGate } from "@/components/AdminGate";
import { Header } from "@/components/Header";
import { DashboardClient } from "@/components/DashboardClient";

export default function DashboardPage() {
  return (
    <div className="min-h-dvh">
      <Header />
      <main>
        <AdminGate>
          <DashboardClient />
        </AdminGate>
      </main>
    </div>
  );
}
