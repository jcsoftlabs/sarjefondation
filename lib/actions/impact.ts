"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { impactStatSchema } from "@/lib/validators/impact";

export type ImpactStatActionState = { ok: true } | { ok: false; error: string };

function parseImpactStatForm(formData: FormData) {
  return impactStatSchema.safeParse({
    label: formData.get("label"),
    labelEn: formData.get("labelEn") || null,
    value: formData.get("value"),
  });
}

export async function createImpactStat(
  _prevState: ImpactStatActionState | null,
  formData: FormData,
): Promise<ImpactStatActionState> {
  const admin = await requireAdmin();
  const parsed = parseImpactStatForm(formData);
  if (!parsed.success) {
    return { ok: false, error: "Le formulaire contient des erreurs." };
  }

  const last = await prisma.impactStat.findFirst({ orderBy: { order: "desc" } });
  const stat = await prisma.impactStat.create({
    data: { ...parsed.data, order: (last?.order ?? -1) + 1 },
  });

  await logAudit({ userId: admin.id, action: "CREATE", entity: "ImpactStat", entityId: stat.id });
  revalidatePath("/dashboard/impact");
  revalidatePath("/");
  revalidatePath("/impact");
  redirect(`/dashboard/impact/${stat.id}`);
}

export async function updateImpactStat(
  id: string,
  _prevState: ImpactStatActionState | null,
  formData: FormData,
): Promise<ImpactStatActionState> {
  const admin = await requireAdmin();
  const parsed = parseImpactStatForm(formData);
  if (!parsed.success) {
    return { ok: false, error: "Le formulaire contient des erreurs." };
  }

  const existing = await prisma.impactStat.findUnique({ where: { id } });
  if (!existing) {
    return { ok: false, error: "Chiffre introuvable." };
  }

  await prisma.impactStat.update({ where: { id }, data: parsed.data });
  await logAudit({ userId: admin.id, action: "UPDATE", entity: "ImpactStat", entityId: id });
  revalidatePath("/dashboard/impact");
  revalidatePath(`/dashboard/impact/${id}`);
  revalidatePath("/");
  revalidatePath("/impact");
  return { ok: true };
}

export async function deleteImpactStat(id: string): Promise<void> {
  const admin = await requireAdmin();
  await prisma.impactStat.delete({ where: { id } });
  await logAudit({ userId: admin.id, action: "DELETE", entity: "ImpactStat", entityId: id });
  revalidatePath("/dashboard/impact");
  revalidatePath("/");
  revalidatePath("/impact");
  redirect("/dashboard/impact");
}

export async function moveImpactStat(id: string, direction: "up" | "down"): Promise<void> {
  await requireAdmin();
  const current = await prisma.impactStat.findUnique({ where: { id } });
  if (!current) return;

  const neighbor = await prisma.impactStat.findFirst({
    where: direction === "up" ? { order: { lt: current.order } } : { order: { gt: current.order } },
    orderBy: { order: direction === "up" ? "desc" : "asc" },
  });
  if (!neighbor) return;

  await prisma.$transaction([
    prisma.impactStat.update({ where: { id: current.id }, data: { order: neighbor.order } }),
    prisma.impactStat.update({ where: { id: neighbor.id }, data: { order: current.order } }),
  ]);

  revalidatePath("/dashboard/impact");
  revalidatePath("/");
  revalidatePath("/impact");
}
