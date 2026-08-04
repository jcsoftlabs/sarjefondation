import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { createArticle } from "@/lib/actions/articles";
import { ArticleForm } from "@/components/admin/ArticleForm";

export const metadata: Metadata = { title: "Nouvel article", robots: { index: false, follow: false } };

export default async function NewArticlePage() {
  await requireAdmin();
  return (
    <div>
      <h1 className="font-display text-h2 text-ink">Nouvel article</h1>
      <div className="mt-6 max-w-2xl">
        <ArticleForm mode="create" action={createArticle} />
      </div>
    </div>
  );
}
