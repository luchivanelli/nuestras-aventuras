"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Plan, Category, Priority } from "@/lib/types";
import { CATEGORIES, PRIORITIES } from "@/lib/types";
type PlanCreateData = Omit<Plan, "id" | "createdAt" | "memory">;

interface PlanFormProps {
  plan?: Plan | null;
  onSave: (data: PlanCreateData, id?: string) => void;
  onClose: () => void;
}

const empty = (): Omit<Plan, "id" | "createdAt"> => ({
  title: "",
  description: "",
  date: "",
  category: "citas",
  status: "pendiente",
  priority: "media",
  location: "",
});

export default function PlanForm({ plan, onSave, onClose }: PlanFormProps) {
  const [form, setForm] = useState<Omit<Plan, "id" | "createdAt">>(empty());

  useEffect(() => {
    if (plan) {
      const { id, createdAt, ...rest } = plan;
      setForm(rest);
    } else {
      setForm(empty());
    }
  }, [plan]);

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm(f => ({ ...f, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;
    const { memory, ...data } = form as any;
    onSave(data, plan?.id);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(45,31,38,0.4)", backdropFilter: "blur(4px)" }}>
      <div className="w-full max-w-md rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{ background: "white" }}>
        {/* Header */}
        <div className="px-6 py-5 border-b flex items-center justify-between"
          style={{ borderColor: "#F0E0E4", background: "linear-gradient(135deg, #FFF5F7, white)" }}>
          <div>
            <h2 className="font-display font-semibold text-lg" style={{ color: "#2D1F26" }}>
              {plan ? "Editar plan" : "Nuevo plan ✨"}
            </h2>
            <p className="text-xs mt-0.5" style={{ color: "#8B7D82" }}>
              {plan ? "Actualizá los detalles" : "¿Qué aventura planeamos?"}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-rose-50 transition-colors"
            style={{ color: "#8B7D82" }}>
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "#8B7D82" }}>
              Título *
            </label>
            <input
              required
              value={form.title}
              onChange={e => set("title", e.target.value)}
              placeholder="ej. Cenar en un lugar nuevo..."
              className="w-full px-4 py-3 rounded-2xl border-2 outline-none text-sm transition-all"
              style={{ borderColor: "#F0E0E4", color: "#2D1F26" }}
              onFocus={e => e.target.style.borderColor = "#C9788A"}
              onBlur={e => e.target.style.borderColor = "#F0E0E4"}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "#8B7D82" }}>
              Descripción
            </label>
            <textarea
              rows={3}
              value={form.description}
              onChange={e => set("description", e.target.value)}
              placeholder="Contá un poco más sobre este plan..."
              className="w-full px-4 py-3 rounded-2xl border-2 outline-none text-sm resize-none transition-all"
              style={{ borderColor: "#F0E0E4", color: "#2D1F26" }}
              onFocus={e => e.target.style.borderColor = "#C9788A"}
              onBlur={e => e.target.style.borderColor = "#F0E0E4"}
            />
          </div>

          {/* Date and Location */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "#8B7D82" }}>
                Fecha
              </label>
              <input
                type="date"
                value={form.date}
                onChange={e => set("date", e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border-2 outline-none text-sm transition-all"
                style={{ borderColor: "#F0E0E4", color: "#2D1F26" }}
                onFocus={e => e.target.style.borderColor = "#C9788A"}
                onBlur={e => e.target.style.borderColor = "#F0E0E4"}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: "#8B7D82" }}>
                Lugar
              </label>
              <input
                value={form.location || ""}
                onChange={e => set("location", e.target.value)}
                placeholder="ej. Palermo..."
                className="w-full px-4 py-3 rounded-2xl border-2 outline-none text-sm transition-all"
                style={{ borderColor: "#F0E0E4", color: "#2D1F26" }}
                onFocus={e => e.target.style.borderColor = "#C9788A"}
                onBlur={e => e.target.style.borderColor = "#F0E0E4"}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "#8B7D82" }}>
              Categoría
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(Object.entries(CATEGORIES) as [Category, typeof CATEGORIES[Category]][]).map(([key, cat]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => set("category", key)}
                  className="flex flex-col items-center gap-1 py-2 px-1 rounded-2xl text-xs font-medium border-2 transition-all"
                  style={{
                    borderColor: form.category === key ? cat.color : "#F0E0E4",
                    background: form.category === key ? cat.bg : "white",
                    color: form.category === key ? cat.color : "#8B7D82",
                  }}>
                  <span className="text-base">{cat.emoji}</span>
                  <span className="leading-tight text-center">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "#8B7D82" }}>
              Importancia
            </label>
            <div className="flex gap-2">
              {(Object.entries(PRIORITIES) as [Priority, typeof PRIORITIES[Priority]][]).map(([key, pri]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => set("priority", key)}
                  className="flex-1 py-2.5 rounded-2xl text-sm font-medium border-2 transition-all"
                  style={{
                    borderColor: form.priority === key ? pri.color : "#F0E0E4",
                    background: form.priority === key ? `${pri.color}18` : "white",
                    color: form.priority === key ? pri.color : "#8B7D82",
                  }}>
                  {pri.label}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-3 rounded-2xl text-sm font-semibold border-2 transition-all hover:bg-gray-50"
              style={{ borderColor: "#F0E0E4", color: "#8B7D82" }}>
              Cancelar
            </button>
            <button type="submit"
              className="flex-1 py-3 rounded-2xl text-sm font-semibold text-white transition-all"
              style={{
                background: "linear-gradient(135deg, #C9788A, #E8A4B0)",
                boxShadow: "0 6px 20px rgba(201,120,138,0.35)",
              }}>
              {plan ? "Guardar cambios" : "Crear plan ✨"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
