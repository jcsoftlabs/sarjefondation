"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { teamMemberSchema } from "@/lib/validators/team";

export type TeamMemberActionState = { ok: true } | { ok: false; error: string };

function parseTeamMemberForm(formData: FormData) {
  return teamMemberSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
    bio: formData.get("bio") || null,
    photoId: formData.get("photoId") || null,
  });
}

export async function createTeamMember(
  _prevState: TeamMemberActionState | null,
  formData: FormData,
): Promise<TeamMemberActionState> {
  const admin = await requireAdmin();
  const parsed = parseTeamMemberForm(formData);
  if (!parsed.success) {
    return { ok: false, error: "Le formulaire contient des erreurs." };
  }

  const last = await prisma.teamMember.findFirst({ orderBy: { order: "desc" } });
  const member = await prisma.teamMember.create({
    data: { ...parsed.data, order: (last?.order ?? -1) + 1 },
  });

  await logAudit({ userId: admin.id, action: "CREATE", entity: "TeamMember", entityId: member.id });
  revalidatePath("/dashboard/equipe");
  redirect(`/dashboard/equipe/${member.id}`);
}

export async function updateTeamMember(
  id: string,
  _prevState: TeamMemberActionState | null,
  formData: FormData,
): Promise<TeamMemberActionState> {
  const admin = await requireAdmin();
  const parsed = parseTeamMemberForm(formData);
  if (!parsed.success) {
    return { ok: false, error: "Le formulaire contient des erreurs." };
  }

  const existing = await prisma.teamMember.findUnique({ where: { id } });
  if (!existing) {
    return { ok: false, error: "Membre introuvable." };
  }

  await prisma.teamMember.update({ where: { id }, data: parsed.data });
  await logAudit({ userId: admin.id, action: "UPDATE", entity: "TeamMember", entityId: id });
  revalidatePath("/dashboard/equipe");
  revalidatePath(`/dashboard/equipe/${id}`);
  return { ok: true };
}

export async function deleteTeamMember(id: string): Promise<void> {
  const admin = await requireAdmin();
  await prisma.teamMember.delete({ where: { id } });
  await logAudit({ userId: admin.id, action: "DELETE", entity: "TeamMember", entityId: id });
  revalidatePath("/dashboard/equipe");
  redirect("/dashboard/equipe");
}

export async function moveTeamMember(id: string, direction: "up" | "down"): Promise<void> {
  await requireAdmin();
  const current = await prisma.teamMember.findUnique({ where: { id } });
  if (!current) return;

  const neighbor = await prisma.teamMember.findFirst({
    where: direction === "up" ? { order: { lt: current.order } } : { order: { gt: current.order } },
    orderBy: { order: direction === "up" ? "desc" : "asc" },
  });
  if (!neighbor) return;

  await prisma.$transaction([
    prisma.teamMember.update({ where: { id: current.id }, data: { order: neighbor.order } }),
    prisma.teamMember.update({ where: { id: neighbor.id }, data: { order: current.order } }),
  ]);

  revalidatePath("/dashboard/equipe");
}
