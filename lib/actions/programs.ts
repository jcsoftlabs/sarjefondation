"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { programSchema } from "@/lib/validators/programs";
import { Prisma } from "@/app/generated/prisma/client";

export type ProgramActionState =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

function parseProgramForm(formData: FormData) {
  let content: unknown = {};
  try {
    content = JSON.parse(String(formData.get("content") ?? "{}"));
  } catch {
    content = {};
  }

  return programSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    summary: formData.get("summary"),
    content,
    coverId: formData.get("coverId") || null,
    isActive: formData.get("isActive") !== "false",
  });
}

export async function createProgram(
  _prevState: ProgramActionState | null,
  formData: FormData,
): Promise<ProgramActionState> {
  const admin = await requireAdmin();
  const parsed = parseProgramForm(formData);
  if (!parsed.success) {
    return { ok: false, error: "Le formulaire contient des erreurs." };
  }

  const slugTaken = await prisma.program.findUnique({ where: { slug: parsed.data.slug } });
  if (slugTaken) {
    return {
      ok: false,
      error: "Ce slug est déjà utilisé par un autre programme.",
      fieldErrors: { slug: "Ce slug est déjà utilisé par un autre programme." },
    };
  }

  const last = await prisma.program.findFirst({ orderBy: { order: "desc" } });

  const program = await prisma.program.create({
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      summary: parsed.data.summary,
      content: parsed.data.content as Prisma.InputJsonValue,
      coverId: parsed.data.coverId,
      isActive: parsed.data.isActive,
      order: (last?.order ?? -1) + 1,
    },
  });

  await logAudit({ userId: admin.id, action: "CREATE", entity: "Program", entityId: program.id });

  revalidatePath("/dashboard/programmes");
  redirect(`/dashboard/programmes/${program.id}`);
}

export async function updateProgram(
  id: string,
  _prevState: ProgramActionState | null,
  formData: FormData,
): Promise<ProgramActionState> {
  const admin = await requireAdmin();
  const parsed = parseProgramForm(formData);
  if (!parsed.success) {
    return { ok: false, error: "Le formulaire contient des erreurs." };
  }

  const existing = await prisma.program.findUnique({ where: { id } });
  if (!existing) {
    return { ok: false, error: "Programme introuvable." };
  }

  const slugTaken = await prisma.program.findUnique({ where: { slug: parsed.data.slug } });
  if (slugTaken && slugTaken.id !== id) {
    return {
      ok: false,
      error: "Ce slug est déjà utilisé par un autre programme.",
      fieldErrors: { slug: "Ce slug est déjà utilisé par un autre programme." },
    };
  }

  await prisma.program.update({
    where: { id },
    data: {
      title: parsed.data.title,
      slug: parsed.data.slug,
      summary: parsed.data.summary,
      content: parsed.data.content as Prisma.InputJsonValue,
      coverId: parsed.data.coverId,
      isActive: parsed.data.isActive,
    },
  });

  await logAudit({ userId: admin.id, action: "UPDATE", entity: "Program", entityId: id });

  revalidatePath("/dashboard/programmes");
  revalidatePath(`/dashboard/programmes/${id}`);
  return { ok: true };
}

export async function deleteProgram(id: string): Promise<void> {
  const admin = await requireAdmin();
  await prisma.program.delete({ where: { id } });
  await logAudit({ userId: admin.id, action: "DELETE", entity: "Program", entityId: id });
  revalidatePath("/dashboard/programmes");
  redirect("/dashboard/programmes");
}

export async function moveProgram(id: string, direction: "up" | "down"): Promise<void> {
  await requireAdmin();
  const current = await prisma.program.findUnique({ where: { id } });
  if (!current) return;

  const neighbor = await prisma.program.findFirst({
    where: direction === "up" ? { order: { lt: current.order } } : { order: { gt: current.order } },
    orderBy: { order: direction === "up" ? "desc" : "asc" },
  });
  if (!neighbor) return;

  await prisma.$transaction([
    prisma.program.update({ where: { id: current.id }, data: { order: neighbor.order } }),
    prisma.program.update({ where: { id: neighbor.id }, data: { order: current.order } }),
  ]);

  revalidatePath("/dashboard/programmes");
}
