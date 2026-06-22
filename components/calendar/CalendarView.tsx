"use client";
import { useState, useMemo } from "react";
import { format, parseISO, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, isToday, isPast, isThisWeek } from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Plan } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";

interface CalendarViewProps {
  plans: Plan[];
}

export default function CalendarView({ plans }: CalendarViewProps) {
  const [current, setCurrent] = useState(new Date());
  const [selected, setSelected] = useState<Date | null>(null);

  const days = useMemo(() => {
    const start = startOfMonth(current);
    const end = endOfMonth(current);
    const allDays = eachDayOfInterval({ start, end });
    const startWeekday = start.getDay() === 0 ? 6 : start.getDay() - 1;
    const prefix = Array.from({ length: startWeekday }, (_, i) => null);
    return [...prefix, ...allDays];
  }, [current]);

  const plansByDate = useMemo(() => {
    const map: Record<string, Plan[]> = {};
    plans.forEach(p => {
      if (p.date) {
        const key = p.date.slice(0, 10);
        if (!map[key]) map[key] = [];
        map[key].push(p);
      }
    });
    return map;
  }, [plans]);

  const selectedPlans = selected
    ? plans.filter(p => p.date && isSameDay(parseISO(p.date), selected))
    : [];

  const upcomingPlans = plans
    .filter(p => p.status === "pendiente" && p.date && !isPast(parseISO(p.date)))
    .sort((a, b) => a.date!.localeCompare(b.date!))
    .slice(0, 5);

  const thisWeekPlans = plans.filter(p =>
    p.date && isThisWeek(parseISO(p.date), { weekStartsOn: 1 })
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-6">
      <div className="mb-6">
        <h1 className="font-display font-semibold text-2xl mb-1" style={{ color: "#2D1F26" }}>
          Calendario 📅
        </h1>
        <p className="text-sm" style={{ color: "#8B7D82" }}>
          {thisWeekPlans.length} planes esta semana
        </p>
      </div>

      {/* Calendar card */}
      <div className="rounded-3xl border p-5 mb-5"
        style={{ background: "white", borderColor: "#F0E0E4" }}>
        {/* Month nav */}
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => setCurrent(d => new Date(d.getFullYear(), d.getMonth() - 1, 1))}
            className="p-2 rounded-xl hover:bg-rose-50 transition-colors"
            style={{ color: "#8B7D82" }}>
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="font-display font-semibold capitalize text-lg" style={{ color: "#2D1F26" }}>
            {format(current, "MMMM yyyy", { locale: es })}
          </h2>
          <button
            onClick={() => setCurrent(d => new Date(d.getFullYear(), d.getMonth() + 1, 1))}
            className="p-2 rounded-xl hover:bg-rose-50 transition-colors"
            style={{ color: "#8B7D82" }}>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 mb-2">
          {["Lu", "Ma", "Mi", "Ju", "Vi", "Sá", "Do"].map(d => (
            <div key={d} className="text-center text-xs font-semibold py-1" style={{ color: "#8B7D82" }}>
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, i) => {
            if (!day) return <div key={i} />;
            const key = format(day, "yyyy-MM-dd");
            const dayPlans = plansByDate[key] || [];
            const isSelected = selected && isSameDay(day, selected);
            const today = isToday(day);
            const inMonth = isSameMonth(day, current);

            return (
              <button
                key={i}
                onClick={() => setSelected(isSelected ? null : day)}
                className="relative flex flex-col items-center py-2 rounded-xl transition-all"
                style={{
                  background: isSelected
                    ? "linear-gradient(135deg, #C9788A, #E8A4B0)"
                    : today
                    ? "#FFF5F7"
                    : "transparent",
                  opacity: inMonth ? 1 : 0.3,
                }}>
                <span className="text-sm font-medium"
                  style={{ color: isSelected ? "white" : today ? "#C9788A" : "#2D1F26" }}>
                  {format(day, "d")}
                </span>
                {dayPlans.length > 0 && (
                  <div className="flex gap-0.5 mt-1">
                    {dayPlans.slice(0, 3).map((p, j) => (
                      <div key={j} className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: isSelected ? "white" : CATEGORIES[p.category].color,
                          opacity: p.status === "completado" ? 0.5 : 1,
                        }} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected day plans */}
      {selected && (
        <div className="rounded-2xl border p-4 mb-5"
          style={{ background: "#FFF5F7", borderColor: "#E8D0D8" }}>
          <p className="font-semibold text-sm mb-3 capitalize"
            style={{ color: "#C9788A" }}>
            {format(selected, "EEEE d 'de' MMMM", { locale: es })}
          </p>
          {selectedPlans.length === 0 ? (
            <p className="text-sm" style={{ color: "#8B7D82" }}>Sin planes este día</p>
          ) : (
            <div className="flex flex-col gap-2">
              {selectedPlans.map(p => {
                const cat = CATEGORIES[p.category];
                return (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl bg-white">
                    <span className="text-lg">{cat.emoji}</span>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${p.status === "completado" ? "line-through opacity-60" : ""}`}
                        style={{ color: "#2D1F26" }}>
                        {p.title}
                      </p>
                      <span className="text-xs" style={{ color: cat.color }}>{cat.label}</span>
                    </div>
                    {p.status === "completado" && (
                      <span className="text-xs px-2 py-0.5 rounded-full"
                        style={{ background: "#F0FFF4", color: "#4CAF50" }}>
                        ✓ Hecho
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Upcoming */}
      {upcomingPlans.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#8B7D82" }}>
            Próximos planes
          </p>
          <div className="flex flex-col gap-2">
            {upcomingPlans.map(p => {
              const cat = CATEGORIES[p.category];
              return (
                <div key={p.id} className="flex items-center gap-3 p-4 rounded-2xl border"
                  style={{ background: "white", borderColor: "#F0E0E4" }}>
                  <span className="text-xl">{cat.emoji}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: "#2D1F26" }}>{p.title}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#8B7D82" }}>
                      📅 {format(parseISO(p.date!), "d 'de' MMMM", { locale: es })}
                      {p.location && ` · ${p.location}`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
