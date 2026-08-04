import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth";
import { createTestimonial } from "@/lib/actions/testimonials";
import { TestimonialForm } from "@/components/admin/TestimonialForm";

export const metadata: Metadata = { title: "Ajouter un témoignage", robots: { index: false, follow: false } };

export default async function NewTestimonialPage() {
  await requireAdmin();
  return (
    <div>
      <h1 className="font-display text-h2 text-ink">Ajouter un témoignage</h1>
      <div className="mt-6 max-w-2xl">
        <TestimonialForm mode="create" action={createTestimonial} />
      </div>
    </div>
  );
}
