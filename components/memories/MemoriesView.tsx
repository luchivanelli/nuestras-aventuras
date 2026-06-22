"use client";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { useState } from "react";
import { Trash2, MapPin, Calendar, Edit2, Maximize2, X, Search } from "lucide-react";
import type { Plan, Category } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";
import EditMemoryModal from "./EditMemoryModal";

type MemoryEditPayload = Omit<Plan["memory"], "completedAt"> & { completedAt?: string };

interface MemoriesViewProps {
  plans: Plan[];
  onDelete: (id: string) => void;
  onEdit: (planId: string, memory: Plan["memory"]) => Promise<Plan>;
}

export default function MemoriesView({ plans, onDelete, onEdit }: MemoriesViewProps) {
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedPhoto, setExpandedPhoto] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<Category | "todas">("todas");
  const completed = plans
    .filter(p => p.status === "completado")
    .sort((a, b) => {
      const dateA = a.memory?.completedAt || a.createdAt;
      const dateB = b.memory?.completedAt || b.createdAt;
      return dateB.localeCompare(dateA);
    });
  const filteredCompleted = completed
    .filter(plan => filterCat === "todas" || plan.category === filterCat)
    .filter(plan => {
      const searchTerm = search.toLowerCase();
      if (!searchTerm) return true;
      return (
        plan.title.toLowerCase().includes(searchTerm) ||
        plan.description?.toLowerCase().includes(searchTerm) ||
        plan.memory?.note?.toLowerCase().includes(searchTerm) ||
        plan.memory?.reflection?.toLowerCase().includes(searchTerm)
      );
    });
  const editingPlan = plans.find(p => p.id === editingPlanId);

  const handleEditMemory = async (memory: {
    note: string;
    reflection: string;
    photos: Array<{ id?: string; url: string }>;
    completedAt?: string;
  }) => {
    try {
      setIsLoading(true);
      await onEdit(editingPlanId!, {
        note: memory.note,
        reflection: memory.reflection,
        photos: memory.photos,
        completedAt: memory.completedAt || new Date().toISOString(),
      });
      setEditingPlanId(null);
    } catch (error) {
      console.error("Error al editar recuerdo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-semibold text-2xl mb-1" style={{ color: "#2D1F26" }}>
          Nuestros Recuerdos 💕
        </h1>
        <p className="text-sm" style={{ color: "#8B7D82" }}>
          {completed.length} {completed.length === 1 ? "aventura vivida" : "aventuras vividas"} juntos
        </p>
      </div>

      {completed.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4 float">💭</div>
          <p className="font-display text-lg font-medium mb-2" style={{ color: "#2D1F26" }}>
            Todavía no hay recuerdos
          </p>
          <p className="text-sm" style={{ color: "#8B7D82" }}>
            Cuando completen planes, aparecerán acá ❤️
          </p>
        </div>
      ) : (
        <>
          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#8B7D82" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar recuerdos..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 outline-none text-sm transition-all"
              style={{ borderColor: "#F0E0E4", color: "#2D1F26", background: "white" }}
              onFocus={e => e.target.style.borderColor = "#C9788A"}
              onBlur={e => e.target.style.borderColor = "#F0E0E4"}
            />
          </div>

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

          {filteredCompleted.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4 float">🔍</div>
              <p className="font-display text-lg font-medium mb-2" style={{ color: "#2D1F26" }}>
                No hay recuerdos que coincidan
              </p>
              <p className="text-sm" style={{ color: "#8B7D82" }}>
                Probá cambiando la búsqueda o los filtros
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filteredCompleted.map((plan, i) => {
                const cat = CATEGORIES[plan.category];
                return (
                  <div
                    key={plan.id}
                    className="fade-in-up rounded-3xl overflow-hidden border"
                    style={{
                      background: "white",
                      borderColor: "#F0E0E4",
                      animationDelay: `${i * 0.05}s`,
                    }}>
                    {/* Top colored band */}
                    <div className="px-4 py-3 flex items-start justify-between"
                      style={{ background: `linear-gradient(135deg, ${cat.bg}, white)` }}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                          style={{ background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
                          {cat.emoji}
                        </div>
                        <div className="space-y-2">
                          <h3 className="font-semibold" style={{ color: "#2D1F26" }}>{plan.title}</h3>
                          <div className="flex items-center flex-wrap gap-2 mt-0.5">
                            <span className="text-xs px-2 py-0.5 rounded-full"
                              style={{ background: cat.bg, color: cat.color }}>
                              {cat.label}
                            </span>
                            {plan.memory?.completedAt && (
                              <span className="text-xs flex items-center gap-1" style={{ color: "#8B7D82" }}>
                                <Calendar className="w-3 h-3" />
                                {format(parseISO(plan.memory.completedAt), "d MMM yyyy", { locale: es })}
                              </span>
                            )}
                            {plan.location && (
                              <p className="text-xs flex items-center gap-1" style={{ color: "#8B7D82" }}>
                                <MapPin className="w-3 h-3" />
                                {plan.location}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => setEditingPlanId(plan.id)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                          style={{ color: "#7A9CC5" }}
                          title="Editar recuerdo">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => onDelete(plan.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          style={{ color: "#8B7D82" }}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="px-3 pb-3">
                      {plan.memory?.photos && plan.memory.photos.length > 0 && (
                        <div className="p-2">
                          <p className="text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: "#8B7D82" }}>
                            Fotos 📸
                          </p>
                          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 mb-2">
                            {plan.memory.photos.map((photo) => (
                              <div key={photo.id} className="rounded-2xl overflow-hidden relative">
                                <button
                                  type="button"
                                  onClick={() => setExpandedPhoto(photo.url)}
                                  className="w-full h-24 overflow-hidden block"
                                  style={{ padding: 0, border: 'none', background: 'none' }}>
                                  <img
                                    src={photo.url}
                                    alt="Foto del recuerdo"
                                    className="w-full h-24 object-cover hover:scale-105 transition-transform"
                                  />
                                </button>
                                <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1 shadow-sm">
                                  <Maximize2 className="w-4 h-4 text-gray-700" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {plan.memory?.note && (
                        <div className="p-2 rounded-2xl mb-2">
                          <p className="text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: "#E8A4B0" }}>
                            Recuerdo 💭
                          </p>
                          <p className="text-sm italic" style={{ color: "#2D1F26" }}>
                            "{plan.memory.note}"
                          </p>
                        </div>
                      )}

                      {plan.memory?.reflection && (
                        <div className="p-2 rounded-2xl">
                          <p className="text-xs font-semibold mb-1 uppercase tracking-wide" style={{ color: "#8FAF9F" }}>
                            Reflexión ✨
                          </p>
                          <p className="text-sm" style={{ color: "#2D1F26" }}>
                            {plan.memory.reflection}
                          </p>
                        </div>
                      )}

                      {!plan.memory?.note && !plan.memory?.reflection && !plan.memory?.photos?.length && (
                        <p className="text-sm" style={{ color: "#8B7D82" }}>
                          Sin nota guardada
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
      {editingPlan && (
        <EditMemoryModal
          plan={editingPlan}
          onConfirm={handleEditMemory}
          onClose={() => setEditingPlanId(null)}
        />
      )}

          {expandedPhoto && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setExpandedPhoto(null)}>
              <div className="relative max-w-4xl w-full max-h-full overflow-hidden rounded-3xl bg-black">
                <button
                  type="button"
                  className="absolute top-4 right-4 z-10 rounded-full bg-white/90 p-2 text-gray-900 shadow-lg"
                  onClick={() => setExpandedPhoto(null)}>
                  <X className="w-5 h-5" />
                </button>
                <img
                  src={expandedPhoto}
                  alt="Foto ampliada"
                  className="w-full h-full object-contain"
                  style={{ maxHeight: '90vh' }}
                />
              </div>
            </div>
          )}
        </div>
  );
}
