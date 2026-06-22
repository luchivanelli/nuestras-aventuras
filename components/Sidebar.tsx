"use client";
import { Heart, List, CheckCircle2, LayoutDashboard, Calendar, Menu, X } from "lucide-react";
import { useState } from "react";

type Tab = "planes" | "completados" | "dashboard" | "calendario";

interface SidebarProps {
  active: Tab;
  onChange: (tab: Tab) => void;
}

const NAV = [
  { id: "planes",      label: "Nuestros Planes",   icon: List,           emoji: "📋" },
  { id: "completados", label: "Recuerdos",          icon: CheckCircle2,   emoji: "💕" },
  { id: "dashboard",   label: "Nuestra Historia",   icon: LayoutDashboard,emoji: "✨" },
  { id: "calendario",  label: "Calendario",         icon: Calendar,       emoji: "📅" },
] as const;

export default function Sidebar({ active, onChange }: SidebarProps) {
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-1 mt-2">
      {NAV.map(({ id, label, icon: Icon, emoji }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => { onChange(id); setOpen(false); }}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl text-left text-sm font-medium transition-all"
            style={{
              background: isActive ? "linear-gradient(135deg, #C9788A15, #E8A4B015)" : "transparent",
              color: isActive ? "#C9788A" : "#8B7D82",
              borderLeft: isActive ? "3px solid #C9788A" : "3px solid transparent",
            }}>
            <span className="text-base">{emoji}</span>
            <span>{label}</span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-60 min-h-screen py-8 px-4 border-r"
        style={{ background: "white", borderColor: "#F0E0E4" }}>
        <div className="flex items-center gap-3 px-4 mb-8">
          <Heart className="w-6 h-6" style={{ color: "#C9788A" }} fill="#C9788A" />
          <div>
            <p className="font-display font-semibold text-base" style={{ color: "#2D1F26" }}>Aventuras</p>
            <p className="text-xs" style={{ color: "#8B7D82" }}>de dos</p>
          </div>
        </div>
        {nav}
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 border-b"
        style={{ background: "white", borderColor: "#F0E0E4" }}>
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5" style={{ color: "#C9788A" }} fill="#C9788A" />
          <span className="font-display font-semibold" style={{ color: "#2D1F26" }}>Aventuras</span>
        </div>
        <button onClick={() => setOpen(o => !o)} style={{ color: "#8B7D82" }}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setOpen(false)}>
          <div className="absolute inset-0" style={{ background: "rgba(45,31,38,0.3)" }} />
          <div className="absolute top-0 left-0 bottom-0 w-64 pt-20 px-4 pb-8"
            style={{ background: "white" }}
            onClick={e => e.stopPropagation()}>
            {nav}
          </div>
        </div>
      )}
    </>
  );
}
