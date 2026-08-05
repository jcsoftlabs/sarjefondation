"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { testimonialSchema } from "@/lib/validators/testimonials";

export type TestimonialActionState = { ok: true } | { ok: false; error: string };

function parseTestimonialForm(formData: FormData) {
  return testimonialSchema.safeParse({
    author: formData.get("author"),
    role: formData.get("role") || null,
    roleEn: formData.get("roleEn") || null,
    quote: formData.get("quote"),
    quoteEn: formData.get("quoteEn") || null,
    photoId: formData.get("photoId") || null,
  });
}

export async function createTestimonial(
  _prevState: TestimonialActionState | null,
  formData: FormData,
): Promise<TestimonialActionState> {
  const admin = await requireAdmin();
  const parsed = parseTestimonialForm(formData);
  if (!parsed.success) {
    return { ok: false, error: "Le formulaire contient des erreurs." };
  }

  const last = await prisma.testimonial.findFirst({ orderBy: { order: "desc" } });
  const testimonial = await prisma.testimonial.create({
    data: { ...parsed.data, order: (last?.order ?? -1) + 1 },
  });

  await logAudit({
    userId: admin.id,
    action: "CREATE",
    entity: "Testimonial",
    entityId: testimonial.id,
  });
  revalidatePath("/dashboard/temoignages");
  revalidatePath("/impact");
  redirect(`/dashboard/temoignages/${testimonial.id}`);
}

export async function updateTestimonial(
  id: string,
  _prevState: TestimonialActionState | null,
  formData: FormData,
): Promise<TestimonialActionState> {
  const admin = await requireAdmin();
  const parsed = parseTestimonialForm(formData);
  if (!parsed.success) {
    return { ok: false, error: "Le formulaire contient des erreurs." };
  }

  const existing = await prisma.testimonial.findUnique({ where: { id } });
  if (!existing) {
    return { ok: false, error: "Témoignage introuvable." };
  }

  await prisma.testimonial.update({ where: { id }, data: parsed.data });
  await logAudit({ userId: admin.id, action: "UPDATE", entity: "Testimonial", entityId: id });
  revalidatePath("/dashboard/temoignages");
  revalidatePath(`/dashboard/temoignages/${id}`);
  revalidatePath("/impact");
  return { ok: true };
}

export async function deleteTestimonial(id: string): Promise<void> {
  const admin = await requireAdmin();
  await prisma.testimonial.delete({ where: { id } });
  await logAudit({ userId: admin.id, action: "DELETE", entity: "Testimonial", entityId: id });
  revalidatePath("/dashboard/temoignages");
  revalidatePath("/impact");
  redirect("/dashboard/temoignages");
}

export async function moveTestimonial(id: string, direction: "up" | "down"): Promise<void> {
  await requireAdmin();
  const current = await prisma.testimonial.findUnique({ where: { id } });
  if (!current) return;

  const neighbor = await prisma.testimonial.findFirst({
    where: direction === "up" ? { order: { lt: current.order } } : { order: { gt: current.order } },
    orderBy: { order: direction === "up" ? "desc" : "asc" },
  });
  if (!neighbor) return;

  await prisma.$transaction([
    prisma.testimonial.update({ where: { id: current.id }, data: { order: neighbor.order } }),
    prisma.testimonial.update({ where: { id: neighbor.id }, data: { order: current.order } }),
  ]);

  revalidatePath("/dashboard/temoignages");
  revalidatePath("/impact");
}
