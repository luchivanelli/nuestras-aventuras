"use client";
import { useState, useEffect, useCallback, useTransition } from "react";
import type { Plan } from "./types";
import {
  getPlans,
  createPlan,
  updatePlan,
  deletePlan,
  completePlan,
  editMemory,
} from "@/app/actions/plans";

const SESSION_KEY = "aventuras-session";

export function useStore() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Initial load
  useEffect(() => {
    getPlans()
      .then(setPlans)
      .catch(console.error)
      .finally(() => setLoaded(true));
  }, []);

  const addPlan = useCallback(async (plan: Omit<Plan, "id" | "createdAt" | "memory">) => {
    const created = await createPlan(plan);
    setPlans(prev => [created, ...prev]);
  }, []);

  const updatePlanFn = useCallback(async (id: string, updates: Partial<Plan>) => {
    const updated = await updatePlan(id, updates);
    setPlans(prev => prev.map(p => p.id === id ? updated : p));
  }, []);

  const deletePlanFn = useCallback(async (id: string) => {
    await deletePlan(id);
    setPlans(prev => prev.filter(p => p.id !== id));
  }, []);

  const completePlanFn = useCallback(async (id: string, memory?: Plan["memory"]) => {
    const updated = await completePlan(id, memory);
    setPlans(prev => prev.map(p => p.id === id ? updated : p));
  }, []);

  const editMemoryFn = useCallback(async (planId: string, memory: Plan["memory"]) => {
    const updated = await editMemory(planId, memory);
    setPlans(prev => prev.map(p => p.id === updated.id ? updated : p));
    return updated;
  }, []);

  return {
    plans,
    loaded,
    isPending,
    addPlan,
    updatePlan: updatePlanFn,
    deletePlan: deletePlanFn,
    completePlan: completePlanFn,
    editMemory: editMemoryFn,
  };
}

export function useSession() {
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const s = sessionStorage.getItem(SESSION_KEY);
    if (s === "true") setUnlocked(true);
    setChecked(true);
  }, []);

  const unlock = useCallback(() => {
    sessionStorage.setItem(SESSION_KEY, "true");
    setUnlocked(true);
  }, []);

  return { unlocked, checked, unlock };
}
