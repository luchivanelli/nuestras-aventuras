"use client";
import { useState } from "react";
import Login from "@/components/Login";
import Sidebar from "@/components/Sidebar";
import PlansView from "@/components/plans/PlansView";
import MemoriesView from "@/components/memories/MemoriesView";
import Dashboard from "@/components/dashboard/Dashboard";
import CalendarView from "@/components/calendar/CalendarView";
import { useStore, useSession } from "@/lib/store";

type Tab = "planes" | "completados" | "dashboard" | "calendario";

export default function Home() {
  const { unlocked, checked, unlock } = useSession();
  const [tab, setTab] = useState<Tab>("planes");
  const { plans, loaded, addPlan, updatePlan, deletePlan, completePlan, editMemory } = useStore();

  if (!checked || !loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #F9EEF1, #FFF5F7)" }}>
        <div className="w-8 h-8 rounded-full border-2 border-rose-300 border-t-rose-500 animate-spin" />
      </div>
    );
  }

  if (!unlocked) return <Login onUnlock={unlock} />;

  return (
    <div className="flex min-h-screen" style={{ background: "#FDFAF8" }}>
      <Sidebar active={tab} onChange={setTab} />

      <main className="flex-1 md:ml-0 mt-16 md:mt-0 overflow-y-auto min-h-screen">
        {tab === "planes" && (
          <PlansView
            plans={plans}
            onAdd={addPlan}
            onUpdate={updatePlan}
            onDelete={deletePlan}
            onComplete={completePlan}
          />
        )}
        {tab === "completados" && (
          <MemoriesView plans={plans} onDelete={deletePlan} onEdit={editMemory} />
        )}
        {tab === "dashboard" && <Dashboard plans={plans} />}
        {tab === "calendario" && <CalendarView plans={plans} />}
      </main>
    </div>
  );
}
