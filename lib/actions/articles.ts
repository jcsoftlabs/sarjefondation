"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { logAudit } from "@/lib/audit";
import { articleSchema, slugify } from "@/lib/validators/articles";
import { Prisma } from "@/app/generated/prisma/client";
import { isEmptyTiptapDoc } from "@/lib/tiptap-empty";

export type ArticleActionState =
  | { ok: true }
  | { ok: false; error: string; fieldErrors?: Record<string, string> };

function parseArticleForm(formData: FormData) {
  const status = formData.get("status");
  let content: unknown = {};
  try {
    content = JSON.parse(String(formData.get("content") ?? "{}"));
  } catch {
    content = {};
  }
  let contentEn: unknown = null;
  const contentEnRaw = formData.get("contentEn");
  if (contentEnRaw) {
    try {
      contentEn = JSON.parse(String(contentEnRaw));
    } catch {
      contentEn = null;
    }
  }
  if (isEmptyTiptapDoc(contentEn)) contentEn = null;

  return articleSchema.safeParse({
    title: formData.get("title"),
    titleEn: formData.get("titleEn") || null,
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    excerptEn: formData.get("excerptEn") || null,
    content,
    contentEn,
    coverId: formData.get("coverId") || null,
    status: status === "PUBLISHED" ? "PUBLISHED" : "DRAFT",
  });
}

export async function checkSlugAvailable(
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  await requireAdmin();
  const existing = await prisma.article.findUnique({ where: { slug } });
  return !existing || existing.id === excludeId;
}

export async function generateSlugFromTitle(title: string): Promise<string> {
  await requireAdmin();
  const base = slugify(title);
  if (!base) return "";
  let candidate = base;
  let suffix = 2;
  while (await prisma.article.findUnique({ where: { slug: candidate } })) {
    candidate = `${base}-${suffix}`;
    suffix += 1;
  }
  return candidate;
}

export async function createArticle(
  _prevState: ArticleActionState | null,
  formData: FormData,
): Promise<ArticleActionState> {
  const admin = await requireAdmin();
  const parsed = parseArticleForm(formData);

  if (!parsed.success) {
    return { ok: false, error: "Le formulaire contient des erreurs." };
  }

  const slugTaken = await prisma.article.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (slugTaken) {
    return {
      ok: false,
      error: "Ce slug est déjà utilisé par un autre article.",
      fieldErrors: { slug: "Ce slug est déjà utilisé par un autre article." },
    };
  }

  const article = await prisma.article.create({
    data: {
      title: parsed.data.title,
      titleEn: parsed.data.titleEn,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt,
      excerptEn: parsed.data.excerptEn,
      content: parsed.data.content as Prisma.InputJsonValue,
      contentEn: parsed.data.contentEn as Prisma.InputJsonValue | undefined,
      coverId: parsed.data.coverId,
      status: parsed.data.status,
      publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null,
    },
  });

  await logAudit({
    userId: admin.id,
    action: "CREATE",
    entity: "Article",
    entityId: article.id,
  });
  if (parsed.data.status === "PUBLISHED") {
    await logAudit({
      userId: admin.id,
      action: "PUBLISH",
      entity: "Article",
      entityId: article.id,
    });
  }

  revalidatePath("/dashboard/articles");
  revalidatePath("/");
  revalidatePath("/actualites");
  revalidatePath(`/actualites/${article.slug}`);
  redirect(`/dashboard/articles/${article.id}`);
}

export async function updateArticle(
  id: string,
  _prevState: ArticleActionState | null,
  formData: FormData,
): Promise<ArticleActionState> {
  const admin = await requireAdmin();
  const parsed = parseArticleForm(formData);

  if (!parsed.success) {
    return { ok: false, error: "Le formulaire contient des erreurs." };
  }

  const existingArticle = await prisma.article.findUnique({ where: { id } });
  if (!existingArticle) {
    return { ok: false, error: "Article introuvable." };
  }

  const slugTaken = await prisma.article.findUnique({
    where: { slug: parsed.data.slug },
  });
  if (slugTaken && slugTaken.id !== id) {
    return {
      ok: false,
      error: "Ce slug est déjà utilisé par un autre article.",
      fieldErrors: { slug: "Ce slug est déjà utilisé par un autre article." },
    };
  }

  const isNewlyPublished =
    parsed.data.status === "PUBLISHED" && existingArticle.status !== "PUBLISHED";

  await prisma.article.update({
    where: { id },
    data: {
      title: parsed.data.title,
      titleEn: parsed.data.titleEn,
      slug: parsed.data.slug,
      excerpt: parsed.data.excerpt,
      excerptEn: parsed.data.excerptEn,
      content: parsed.data.content as Prisma.InputJsonValue,
      contentEn: parsed.data.contentEn as Prisma.InputJsonValue | undefined,
      coverId: parsed.data.coverId,
      status: parsed.data.status,
      publishedAt: isNewlyPublished
        ? new Date()
        : existingArticle.publishedAt,
    },
  });

  await logAudit({
    userId: admin.id,
    action: "UPDATE",
    entity: "Article",
    entityId: id,
  });
  if (isNewlyPublished) {
    await logAudit({
      userId: admin.id,
      action: "PUBLISH",
      entity: "Article",
      entityId: id,
    });
  }

  revalidatePath("/dashboard/articles");
  revalidatePath(`/dashboard/articles/${id}`);
  revalidatePath("/");
  revalidatePath("/actualites");
  revalidatePath(`/actualites/${existingArticle.slug}`);
  if (parsed.data.slug !== existingArticle.slug) {
    revalidatePath(`/actualites/${parsed.data.slug}`);
  }
  return { ok: true };
}

export async function deleteArticle(id: string): Promise<void> {
  const admin = await requireAdmin();
  const article = await prisma.article.delete({ where: { id } });
  await logAudit({
    userId: admin.id,
    action: "DELETE",
    entity: "Article",
    entityId: id,
  });
  revalidatePath("/dashboard/articles");
  revalidatePath("/");
  revalidatePath("/actualites");
  revalidatePath(`/actualites/${article.slug}`);
  redirect("/dashboard/articles");
}
