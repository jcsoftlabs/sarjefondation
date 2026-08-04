import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { moveTestimonial } from "@/lib/actions/testimonials";
import { Card } from "@/components/ui/Card";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { ReorderButtons } from "@/components/admin/ReorderButtons";

export const metadata: Metadata = { title: "Témoignages", robots: { index: false, follow: false } };

export default async function TemoignagesAdminPage() {
  await requireAdmin();
  const testimonials = await prisma.testimonial.findMany({ orderBy: { order: "asc" } });

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-h2 text-ink">Témoignages</h1>
        <ButtonLink href="/dashboard/temoignages/nouveau" variant="primary">
          Ajouter un témoignage
        </ButtonLink>
      </div>

      <div className="mt-6">
        {testimonials.length === 0 && (
          <Card>
            <p className="text-sm text-muted">
              Aucun témoignage pour le moment.{" "}
              <Link
                href="/dashboard/temoignages/nouveau"
                className="text-accent-deep hover:underline"
              >
                Ajouter le premier témoignage
              </Link>
              .
            </p>
          </Card>
        )}

        {testimonials.length > 0 && (
          <Card className="p-0">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="flex items-center gap-4 border-b border-line px-5 py-3 last:border-b-0"
              >
                <ReorderButtons
                  id={testimonial.id}
                  isFirst={index === 0}
                  isLast={index === testimonials.length - 1}
                  move={moveTestimonial}
                />
                <Link href={`/dashboard/temoignages/${testimonial.id}`} className="flex-1">
                  <p className="text-sm font-medium text-ink hover:text-accent-deep">
                    {testimonial.author}
                  </p>
                  <p className="line-clamp-1 text-xs text-muted">{testimonial.quote}</p>
                </Link>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
