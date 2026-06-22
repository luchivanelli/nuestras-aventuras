"use client";
import { useMemo } from "react";
import { format, parseISO, differenceInDays, isPast, isThisWeek } from "date-fns";
import { es } from "date-fns/locale";
import { Heart, Star, Calendar, Trophy, Target, Flame } from "lucide-react";
import type { Plan, Category } from "@/lib/types";
import { CATEGORIES } from "@/lib/types";

interface DashboardProps {
  plans: Plan[];
}

const ANNIVERSARY = new Date("2026-05-25");

export default function Dashboard({ plans }: DashboardProps) {
  const stats = useMemo(() => {
    const total = plans.length;
    const completed = plans.filter(p => p.status === "completado").length;
    const pending = plans.filter(p => p.status === "pendiente").length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    const memories = plans.filter(p => p.memory?.note).length;
    const daysTogeter = differenceInDays(new Date(), ANNIVERSARY);

    // Next plan
    const upcoming = plans
      .filter(p => p.status === "pendiente" && p.date && !isPast(parseISO(p.date)))
      .sort((a, b) => a.date!.localeCompare(b.date!));
    const nextPlan = upcoming[0];

    // This week
    const thisWeek = plans.filter(p => p.date && isThisWeek(parseISO(p.date), { weekStartsOn: 1 })).length;

    // Most used category
    const catCount: Record<string, number> = {};
    plans.forEach(p => { catCount[p.category] = (catCount[p.category] || 0) + 1; });
    const topCat = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0];

    return { total, completed, pending, percent, memories, daysTogeter, nextPlan, thisWeek, topCat };
  }, [plans]);

  const statCards = [
    {
      label: "Días juntos",
      value: stats.daysTogeter,
      icon: Heart,
      gradient: "linear-gradient(135deg, #C9788A, #E8A4B0)",
      emoji: "❤️",
    },
    {
      label: "Planes creados",
      value: stats.total,
      icon: Target,
      gradient: "linear-gradient(135deg, #7A9CC5, #A8C5E8)",
      emoji: "📋",
    },
    {
      label: "Aventuras vividas",
      value: stats.completed,
      icon: Trophy,
      gradient: "linear-gradient(135deg, #C4A882, #E8D5B7)",
      emoji: "🏆",
    },
    {
      label: "Recuerdos guardados",
      value: stats.memories,
      icon: Star,
      gradient: "linear-gradient(135deg, #8FAF9F, #C5DDD5)",
      emoji: "✨",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 md:py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display font-semibold text-2xl mb-1" style={{ color: "#2D1F26" }}>
          Nuestra Historia ✨
        </h1>
        <p className="text-sm" style={{ color: "#8B7D82" }}>
          Todo lo que construimos juntos
        </p>
      </div>

      {/* Days together — hero card */}
      <div className="rounded-3xl p-7 mb-6 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #C9788A 0%, #E8A4B0 50%, #F5D0DB 100%)" }}>
        <div className="absolute top-0 right-0 text-9xl opacity-10 select-none" style={{ lineHeight: 1 }}>❤️</div>
        <div className="relative">
          <p className="text-white text-sm font-medium opacity-80 mb-1">Llevamos juntos</p>
          <p className="text-white font-display font-semibold text-5xl mb-1">
            {stats.daysTogeter}
          </p>
          <p className="text-white text-lg opacity-90 mb-4">días de amor 💕</p>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-white opacity-70" />
            <p className="text-white text-xs opacity-70">
              Desde el 25 de mayo de 2026
            </p>
          </div>
        </div>
      </div>

      {/* Stat cards grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {statCards.slice(1).map(({ label, value, emoji, gradient }) => (
          <div key={label} className="card-hover rounded-2xl p-5 border"
            style={{ background: "white", borderColor: "#F0E0E4" }}>
            <div className="text-2xl mb-3">{emoji}</div>
            <p className="font-display font-semibold text-3xl mb-0.5" style={{ color: "#2D1F26" }}>
              {value}
            </p>
            <p className="text-xs" style={{ color: "#8B7D82" }}>{label}</p>
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="rounded-2xl p-5 border mb-4"
        style={{ background: "white", borderColor: "#F0E0E4" }}>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold" style={{ color: "#2D1F26" }}>
            Aventuras completadas
          </p>
          <p className="font-display font-semibold text-xl" style={{ color: "#C9788A" }}>
            {stats.percent}%
          </p>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: "#F5E6E9" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${stats.percent}%`,
              background: "linear-gradient(90deg, #C9788A, #E8A4B0)",
            }}
          />
        </div>
        <p className="text-xs mt-2" style={{ color: "#8B7D82" }}>
          {stats.completed} de {stats.total} planes completados
        </p>
      </div>

      {/* Next plan */}
      {stats.nextPlan && (
        <div className="rounded-2xl p-5 border mb-4"
          style={{ background: "#FFF5F7", borderColor: "#E8D0D8" }}>
          <div className="flex items-center gap-2 mb-2">
            <Flame className="w-4 h-4" style={{ color: "#C9788A" }} />
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#C9788A" }}>
              Próxima aventura
            </p>
          </div>
          <p className="font-semibold" style={{ color: "#2D1F26" }}>
            {stats.nextPlan.title}
          </p>
          {stats.nextPlan.date && (
            <p className="text-sm mt-1" style={{ color: "#8B7D82" }}>
              📅 {format(parseISO(stats.nextPlan.date), "EEEE d 'de' MMMM", { locale: es })}
            </p>
          )}
        </div>
      )}

      {/* Top category */}
      {stats.topCat && (
        <div className="rounded-2xl p-5 border"
          style={{ background: "white", borderColor: "#F0E0E4" }}>
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: "#8B7D82" }}>
            Categoría favorita
          </p>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{CATEGORIES[stats.topCat[0] as Category].emoji}</span>
            <div>
              <p className="font-semibold" style={{ color: "#2D1F26" }}>
                {CATEGORIES[stats.topCat[0] as Category].label}
              </p>
              <p className="text-xs" style={{ color: "#8B7D82" }}>
                {stats.topCat[1]} planes en esta categoría
              </p>
            </div>
          </div>
        </div>
      )}

      {plans.length === 0 && (
        <div className="text-center py-8">
          <p className="text-4xl mb-3 float">🌟</p>
          <p className="text-sm" style={{ color: "#8B7D82" }}>
            Empezá a crear planes para ver las estadísticas aquí
          </p>
        </div>
      )}
    </div>
  );
}
