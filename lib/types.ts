export type Category =
  | "citas"
  | "salidas"
  | "viajes"
  | "comidas"
  | "futbol"
  | "entrenamiento"
  | "sorpresas";

export type Priority = "baja" | "media" | "alta";
export type Status = "pendiente" | "completado";

export interface Memory {
  note: string;
  reflection: string;
  completedAt: string;
  photos?: Array<{ id: string; url: string }>;
}

export type EditMemoryPayload = {
  note: string;
  reflection: string;
  photos: Array<{ id?: string; url: string }>;
  completedAt?: string;
};

export interface Plan {
  id: string;
  title: string;
  description: string;
  date: string;
  category: Category;
  status: Status;
  priority: Priority;
  location?: string;
  memory?: Memory;
  createdAt: string;
}

export const CATEGORIES: Record<Category, { label: string; emoji: string; color: string; bg: string }> = {
  citas:        { label: "Citas",       emoji: "❤️",  color: "#C9788A", bg: "#F5E6E9" },
  salidas:      { label: "Salidas",     emoji: "🍿",  color: "#8FAF9F", bg: "#C5DDD5" },
  viajes:       { label: "Viajes",      emoji: "✈️",  color: "#7A9CC5", bg: "#D5E5F5" },
  comidas:      { label: "Comidas",     emoji: "🍔",  color: "#C4A882", bg: "#E8D5B7" },
  futbol:       { label: "Fútbol",      emoji: "⚽",  color: "#7AAF7A", bg: "#C5DFC5" },
  entrenamiento:{ label: "Entrena",     emoji: "🏋️", color: "#9F7AC4", bg: "#DDD5F5" },
  sorpresas:    { label: "Sorpresas",   emoji: "🎁",  color: "#C47A7A", bg: "#F5D5D5" },
};

export const PRIORITIES: Record<Priority, { label: string; color: string }> = {
  baja:  { label: "Normal",    color: "#8FAF9F" },
  media: { label: "Importante",color: "#C4A882" },
  alta:  { label: "Especial",  color: "#C9788A" },
};
