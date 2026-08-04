import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { updateTestimonial } from "@/lib/actions/testimonials";
import { TestimonialForm } from "@/components/admin/TestimonialForm";

export const metadata: Metadata = { title: "Modifier le témoignage", robots: { index: false, follow: false } };

export default async function EditTestimonialPage(
  props: PageProps<"/dashboard/temoignages/[id]">,
) {
  await requireAdmin();
  const { id } = await props.params;

  const testimonial = await prisma.testimonial.findUnique({
    where: { id },
    include: { photo: true },
  });
  if (!testimonial) notFound();

  return (
    <div>
      <h1 className="font-display text-h2 text-ink">{testimonial.author}</h1>
      <div className="mt-6 max-w-2xl">
        <TestimonialForm
          mode="edit"
          action={updateTestimonial.bind(null, id)}
          testimonial={{
            id: testimonial.id,
            author: testimonial.author,
            role: testimonial.role,
            quote: testimonial.quote,
            photo: testimonial.photo
              ? { id: testimonial.photo.id, url: testimonial.photo.url, alt: testimonial.photo.alt }
              : null,
          }}
        />
      </div>
    </div>
  );
}
