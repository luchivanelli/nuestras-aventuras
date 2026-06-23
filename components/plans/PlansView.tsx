"use client";
import { useState } from "react";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import type { Plan, Category } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import PlanCard from "./PlanCard";
import PlanForm from "./PlanForm";
import CompleteModal from "./CompleteModal";

interface PlansViewProps {
  plans: Plan[];
  onAdd: (plan: Omit<Plan, "id" | "createdAt" | "memory">) => Promise<void>;
  onUpdate: (id: string, updates: Partial<Plan>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onComplete: (id: string, memory?: Plan["memory"]) => Promise<void>;
}

export default function PlansView({ plans, onAdd, onUpdate, onDelete, onComplete }: PlansViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [completingPlan, setCompletingPlan] = useState<Plan | null>(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<Category | "todas">("todas");

  const pending = plans.filter(p => p.status === "pendiente");

  const filtered = pending
    .filter(p => filterCat === "todas" || p.category === filterCat)
    .filter(p =>
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      const pOrder = { alta: 0, media: 1, baja: 2 };
      if (pOrder[a.priority] !== pOrder[b.priority]) return pOrder[a.priority] - pOrder[b.priority];
      if (!a.date && !b.date) return 0;
      if (!a.date) return 1;
      if (!b.date) return -1;
      return a.date.localeCompare(b.date);
    });

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display font-semibold text-2xl" style={{ color: "#2D1F26" }}>
            Nuestros Planes
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "#8B7D82" }}>
            {pending.length} {pending.length === 1 ? "aventura" : "aventuras"} por vivir
          </p>
        </div>
        <button
          onClick={() => { setEditingPlan(null); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold text-white transition-all"
          style={{
            background: "linear-gradient(135deg, #C9788A, #E8A4B0)",
            boxShadow: "0 6px 20px rgba(201,120,138,0.3)",
          }}>
          <Plus className="w-4 h-4" />
          Nuevo plan
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#8B7D82" }} />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar planes..."
          className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 outline-none text-sm transition-all"
          style={{ borderColor: "#F0E0E4", color: "#2D1F26", background: "white" }}
          onFocus={e => e.target.style.borderColor = "#C9788A"}
          onBlur={e => e.target.style.borderColor = "#F0E0E4"}
        />
      </div>

      {/* Category filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setFilterCat("todas")}
          className="flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border-2 transition-all"
          style={{
            borderColor: filterCat === "todas" ? "#C9788A" : "#F0E0E4",
            background: filterCat === "todas" ? "#F5E6E9" : "white",
            color: filterCat === "todas" ? "#C9788A" : "#8B7D82",
          }}>
          Todas
        </button>
        {(Object.entries(CATEGORIES) as [Category, typeof CATEGORIES[Category]][]).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => setFilterCat(filterCat === key ? "todas" : key)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border-2 transition-all"
            style={{
              borderColor: filterCat === key ? cat.color : "#F0E0E4",
              background: filterCat === key ? cat.bg : "white",
              color: filterCat === key ? cat.color : "#8B7D82",
            }}>
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Plans */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4 float">✨</div>
          <p className="font-display text-lg font-medium mb-2" style={{ color: "#2D1F26" }}>
            {pending.length === 0 ? "¡Empezá a planear!" : "No hay planes que coincidan"}
          </p>
          <p className="text-sm" style={{ color: "#8B7D82" }}>
            {pending.length === 0
              ? "Agregá su primera aventura juntos 💕"
              : "Probá cambiando los filtros"}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map(plan => (
            <PlanCard
              key={plan.id}
              plan={plan}
              onEdit={p => { setEditingPlan(p); setShowForm(true); }}
              onDelete={onDelete}
              onComplete={p => setCompletingPlan(p)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      {showForm && (
        <PlanForm
          plan={editingPlan}
          onSave={(data, id) => id ? onUpdate(id, data) : onAdd(data)}
          onClose={() => { setShowForm(false); setEditingPlan(null); }}
        />
      )}
      {completingPlan && (
        <CompleteModal
          plan={completingPlan}
          onConfirm={async (memory) => {
            await onComplete(completingPlan.id, memory);
            setCompletingPlan(null);
          }}
          onClose={() => setCompletingPlan(null)}
        />
      )}
    </div>
  );
}
