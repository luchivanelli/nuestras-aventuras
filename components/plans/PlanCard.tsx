"use client";
import { format, parseISO, isPast } from "date-fns";
import { es } from "date-fns/locale";
import { Edit2, Trash2, MapPin, CheckCircle2, Circle } from "lucide-react";
import type { Plan } from "@/lib/types";
import { CATEGORIES, PRIORITIES } from "@/lib/types";

interface PlanCardProps {
  plan: Plan;
  onEdit: (plan: Plan) => void;
  onDelete: (id: string) => void;
  onComplete: (plan: Plan) => void;
}

export default function PlanCard({ plan, onEdit, onDelete, onComplete }: PlanCardProps) {
  const cat = CATEGORIES[plan.category];
  const pri = PRIORITIES[plan.priority];
  const isOverdue = plan.status === "pendiente" && plan.date && isPast(parseISO(plan.date));

  return (
    <div className="card-hover rounded-2xl p-5 border fade-in-up"
      style={{
        background: "white",
        borderColor: "#F0E0E4",
        opacity: plan.status === "completado" ? 0.7 : 1,
      }}>
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <button
          onClick={() => plan.status === "pendiente" && onComplete(plan)}
          className="mt-0.5 flex-shrink-0 transition-transform hover:scale-110"
          disabled={plan.status === "completado"}>
          {plan.status === "completado"
            ? <CheckCircle2 className="w-6 h-6" style={{ color: "#C9788A" }} fill="#F5E6E9" />
            : <Circle className="w-6 h-6" style={{ color: "#D0B0B8" }} />}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className={`font-semibold text-base leading-snug ${plan.status === "completado" ? "line-through" : ""}`}
              style={{ color: "#2D1F26" }}>
              {plan.title}
            </h3>
            <div className="flex gap-1 flex-shrink-0">
              {plan.status === "pendiente" && (
                <button onClick={() => onEdit(plan)}
                  className="p-1.5 rounded-lg transition-colors hover:bg-rose-50"
                  style={{ color: "#8B7D82" }}>
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
              <button onClick={() => onDelete(plan.id)}
                className="p-1.5 rounded-lg transition-colors hover:bg-red-50"
                style={{ color: "#8B7D82" }}>
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {plan.description && (
            <p className="text-sm mb-2 leading-relaxed" style={{ color: "#8B7D82" }}>
              {plan.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2">
            {/* Category badge */}
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: cat.bg, color: cat.color }}>
              <span>{cat.emoji}</span>
              {cat.label}
            </span>

            {/* Priority */}
            <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: `${pri.color}18`, color: pri.color }}>
              {plan.priority === "alta" ? "⭐" : plan.priority === "media" ? "•" : "·"} {pri.label}
            </span>

            {/* Date */}
            {plan.date && (
              <span className="text-xs px-2.5 py-1 rounded-full"
                style={{
                  background: isOverdue ? "#FEE8E8" : "#F5F0F8",
                  color: isOverdue ? "#C47A7A" : "#8B7D82",
                }}>
                📅 {format(parseISO(plan.date), "d MMM yyyy", { locale: es })}
                {isOverdue && " · vencido"}
              </span>
            )}

            {/* Location */}
            {plan.location && (
              <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full"
                style={{ background: "#F5F0F8", color: "#8B7D82" }}>
                <MapPin className="w-3 h-3" />
                {plan.location}
              </span>
            )}
          </div>

          {/* Memory preview (completed) */}
          {plan.memory?.note && (
            <div className="mt-3 p-3 rounded-xl text-sm italic"
              style={{ background: "#FFF5F7", color: "#C9788A", borderLeft: "3px solid #E8A4B0" }}>
              💭 "{plan.memory.note}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
