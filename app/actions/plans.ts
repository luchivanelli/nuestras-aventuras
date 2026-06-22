"use server";

import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import type { Plan, Memory } from "@/lib/types";

// ─── Helpers ────────────────────────────────────────────────────────────────

function toClientPlan(raw: any): Plan {
  return {
    id: raw.id,
    title: raw.title,
    description: raw.description ?? "",
    date: raw.date ?? "",
    category: raw.category as Plan["category"],
    status: raw.status as Plan["status"],
    priority: raw.priority as Plan["priority"],
    location: raw.location ?? undefined,
    createdAt: raw.createdAt instanceof Date
      ? raw.createdAt.toISOString()
      : raw.createdAt,
    memory: raw.memory
      ? {
          note: raw.memory.note ?? "",
          reflection: raw.memory.reflection ?? "",
          photos: raw.memory.photos?.map((p: any) => ({ id: p.id, url: p.url })) ?? [],
          completedAt: raw.memory.completedAt instanceof Date
            ? raw.memory.completedAt.toISOString()
            : raw.memory.completedAt,
        }
      : undefined,
  };
}

// ─── Queries ────────────────────────────────────────────────────────────────

export async function getPlans(): Promise<Plan[]> {
  const plans = await prisma.plan.findMany({
    include: { memory: { include: { photos: true } } },
    orderBy: { createdAt: "desc" },
  });
  return plans.map(toClientPlan);
}

// ─── Mutations ──────────────────────────────────────────────────────────────

export async function createPlan(data: Omit<Plan, "id" | "createdAt" | "memory">): Promise<Plan> {
  const plan = await prisma.plan.create({
    data: {
      title: data.title,
      description: data.description ?? "",
      date: data.date || null,
      category: data.category,
      status: data.status,
      priority: data.priority,
      location: data.location || null,
    },
    include: { memory: { include: { photos: true } } },
  });
  revalidatePath("/");
  return toClientPlan(plan);
}

export async function updatePlan(id: string, data: Partial<Plan>): Promise<Plan> {
  const plan = await prisma.plan.update({
    where: { id },
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.date !== undefined && { date: data.date || null }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.priority !== undefined && { priority: data.priority }),
      ...(data.location !== undefined && { location: data.location || null }),
    },
    include: { memory: { include: { photos: true } } },
  });
  revalidatePath("/");
  return toClientPlan(plan);
}

export async function deletePlan(id: string): Promise<void> {
  await prisma.plan.delete({ where: { id } });
  revalidatePath("/");
}

export async function completePlan(id: string, memory?: Memory): Promise<Plan> {
  const plan = await prisma.plan.update({
    where: { id },
    data: {
      status: "completado",
      ...(memory && {
        memory: {
          upsert: {
            create: {
              note: memory.note ?? "",
              reflection: memory.reflection ?? "",
              completedAt: memory.completedAt
                ? new Date(memory.completedAt)
                : new Date(),
              photos: {
                create: memory.photos?.map(p => ({
                  url: p.url,
                })) ?? [],
              },
            },
            update: {
              note: memory.note ?? "",
              reflection: memory.reflection ?? "",
              completedAt: memory.completedAt
                ? new Date(memory.completedAt)
                : new Date(),
            },
          },
        },
      }),
    },
    include: { memory: { include: { photos: true } } },
  });
  revalidatePath("/");
  return toClientPlan(plan);
}

export async function editMemory(
  planId: string,
  memory: {
    note: string;
    reflection: string;
    photos: Array<{ id?: string; url: string }>;
  }
): Promise<Plan> {
  // Get the current memory to find which photos to delete
  const currentMemory = await prisma.memory.findUnique({
    where: { planId },
    include: { photos: true },
  });

  // Find photos that should be deleted (those not in the new list)
  const photosToDelete = currentMemory?.photos.filter(
    p => !memory.photos.some(newP => newP.id === p.id)
  ) ?? [];

  // Update memory and handle photos
  const updatedPlan = await prisma.plan.update({
    where: { id: planId },
    data: {
      memory: {
        update: {
          note: memory.note,
          reflection: memory.reflection,
          photos: {
            // Delete photos that are not in the new list
            deleteMany: {
              id: { in: photosToDelete.map(p => p.id) },
            },
            // Create new photos
            create: memory.photos
              .filter(p => !p.id || p.id.startsWith('new-'))
              .map(p => ({
                url: p.url,
              })),
          },
        },
      },
    },
    include: { memory: { include: { photos: true } } },
  });

  revalidatePath("/");
  return toClientPlan(updatedPlan);
}
